import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { ProductCategory } from '../../common/productCategory';
import { ProductCategoryService } from '../../services/productCategory.service';

@Component({
  selector: 'app-product-form',
  imports: [],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit{

  product!: Product;
  products: Product[] = [];
  productCategory!: ProductCategory;
  productCategories: ProductCategory[] = [];

  constructor(private productService: ProductService, private router: Router, private route: ActivatedRoute, private productCategoryService: ProductCategoryService){
    this.product = new Product();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id:number = +(params.get('id') || '0');
      if (id > 0){
        this.productService.findProductById(id).subscribe(product => this.product = product);
      }
    })
    this.chargeProductCategories();
  }

  onSubmit(productForm: NgForm): void {
    if (!this.product.productCategoryId){
      Swal.fire("Error","You must select a Category", "error");
    }

    const productToSend = {
      id: this.product.id,
      sku: this.product.sku,
      name: this.product.name,
      description: this.product.description,
      unitPrice: this.product.unitPrice,
      imageUrl: this.product.imageUrl,
      active: this.product.active,
      unitsInStock: this.product.unitsInStock,
      dateCreated: this.product.dateCreated, 
      lastUpdated: this.product.lastUpdated,
      productCategory: { id: Number(this.product.productCategoryId) }
    };

    if (this.product.id > 0){
      this.productService.updateProduct(productToSend).subscribe(productUpdated => {
        this.products = this.products.map(p =>
        p.id === productUpdated.id ? {...productUpdated } : p
      );
      this.router.navigate(['/products'], { state: { products: this.products } });
      Swal.fire("Updated!", "¡Product updated succesfully!", "success");
      }, error => {
        console.error("Product did not updated")
      })    
    } else {
      this.productService.saveProduct(productToSend).subscribe(productNew => {
        console.log(productNew);
        this.products.push(productNew);
        this.router.navigate(['products']);
        Swal.fire("New Product Created!", "¡Product Created succesfully!", "success");
      }, error => {
        console.error("Product did not created");
      });
    }

  }

  chargeProductCategories(): void {
      this.productCategoryService.productCategoryList().subscribe(productCategories => {
        this.productCategories = productCategories;
        console.log('Product categories charged: ', this.productCategories); // Verificar que llegan datos
      }, error => {
        console.error('Error while chargin product categories:', error);
      });
  }




}
