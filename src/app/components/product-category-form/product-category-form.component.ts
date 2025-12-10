import { Component, OnInit } from '@angular/core';
import { ProductCategoryService } from '../../services/productCategory.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductCategory } from '../../common/productCategory';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-category-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './product-category-form.component.html',
  styleUrl: './product-category-form.component.css'
})
export class ProductCategoryFormComponent implements OnInit{

  productCategory!: ProductCategory; 

  constructor(private productCategoryService: ProductCategoryService, private router: Router, private route: ActivatedRoute){
    this.productCategory = new ProductCategory();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id:number = +(params.get('id') || '0');
      if (id > 0){
        this.productCategoryService.findProductCategoryById(id).subscribe(productCategory => this.productCategory = productCategory);
      }
    })
  }

  onSubmit(productCategoryForm: NgForm): void {
    if (productCategoryForm.invalid) return;

    const productCategory = productCategoryForm.valid;

    if (this.productCategory.id > 0){
      this.productCategoryService.updateProduct(this.productCategory).subscribe(
        productCategoryUpdated => {
          Swal.fire({
            title: "Udpdated",
            text: "Product Category Updated Succesfully",
            icon: "success"
          });
          this.router.navigate(['/product-categories']);
        }, error => {
          console.error("Error while updating the product categoory");
        }
      );
    } else {
      this.productCategoryService.saveProduct(this.productCategory).subscribe(
        newProductCategory => {
          Swal.fire({
            title: "Created",
            text: "Product Category Created Succesfully",
            icon: 'success'
          });
          this.router.navigate(['/products']);
        }, error => {
          console.error("Error while saving the product category")
        }
      )
    }
  }



}
