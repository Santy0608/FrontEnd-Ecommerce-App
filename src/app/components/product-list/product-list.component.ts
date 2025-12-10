import { Component, NgModule, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { animationFrameProvider } from 'rxjs/internal/scheduler/animationFrameProvider';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, NgbModule, NgbPaginationModule, RouterLink],
  templateUrl: './product-list-grid.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit{

  searchMode: boolean = false;
  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  thePageNumber: number = 1;
  thePageSize: number = 10;
  theTotalElements: number = 0;

  previousKeywordString: string = "";

  constructor(private productService: ProductService, private route: ActivatedRoute, private cartService: CartService){

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    })
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode){
      this.handleSearchProducts();
    } else {
      this.handleListProducts();    
    }
  }

  handleSearchProducts(){
    const keyWord: string | null = this.route.snapshot.paramMap.get('keyword');
    
    if (this.previousKeywordString != keyWord){
      this.thePageNumber = 1;
    }

    this.previousKeywordString = keyWord!;


    this.productService.searchProductsPaginate(this.thePageNumber - 1,
                                              this.thePageSize,
                                              keyWord!).subscribe(this.processResult())
    

  }

  handleListProducts(){
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.currentCategoryId = +id;
    } else {
      this.currentCategoryId = 1;
    }



    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    this.productService.getProductListPaginate(this.thePageNumber - 1,
                                               this.thePageSize,
                                               this.currentCategoryId  
                                              ).subscribe(
                                                this.processResult()
                                              );

  }


  updatePageSize(pageSize: string): void {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  processResult(){
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  addToCart(theProduct: Product){
    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);
    
  }

}
