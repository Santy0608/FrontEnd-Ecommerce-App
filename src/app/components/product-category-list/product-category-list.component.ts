import { Component, OnInit } from '@angular/core';
import { ProductCategory } from '../../common/productCategory';
import { ProductCategoryService } from '../../services/productCategory.service';
import Swal from 'sweetalert2';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-category-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './product-category-list.component.html',
  styleUrl: './product-category-list.component.css'
})
export class ProductCategoryListComponent implements OnInit{

  productCategories: ProductCategory[] = [];

  constructor(private productCategoryService: ProductCategoryService, private router: Router){

  }

  ngOnInit(): void {
    this.productCategoryList();
  }

  productCategoryList(){
    this.productCategoryService.productCategoryList().subscribe(
      data => {
        this.productCategories = data;
      }
    )
  }


  onRemoveProductCategory(id: number){
     // Buscar la categoría dentro del listado
  const productCategory = this.productCategories.find(c => c.id === id);
  if (!productCategory) {
    console.error(`Product category not found by id: ${id}`);
    return;
  }

  Swal.fire({
    title: "¿Are you sure?",
    text: "Beware, this category will be deleted from the system.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it"
  }).then((result) => {
    if (result.isConfirmed) {
      this.productCategoryService.deleteProductCategoryById(id).subscribe({
        next: () => {
          this.productCategories = this.productCategories.filter(c => c.id !== id);

          // Navegación (si es necesaria)
          this.router.navigate(['/product-categories/create'], { skipLocationChange: true }).then(() => {
            this.router.navigate(['/product-categories'], { state: { productCategories: this.productCategories } });
          });

          Swal.fire("¡Delete it!", "The category has been deleted succesfully", "success");
        },
        error: (err) => {
          console.error(err);
          Swal.fire("Error", "Error while deleting the category", "error");
        }
      });
    }
  });
  }

  OnSelectedProductCategory(productCategory: ProductCategory): void{
      this.router.navigate(['/product-categories/edit', productCategory.id])
  }

}
