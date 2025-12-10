import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable, tap } from "rxjs";
import { ProductCategory } from "../common/productCategory";
import { Product } from "../common/product";


@Injectable({
    providedIn: 'root'
})
export class ProductCategoryService{

    private baseUrl: string = 'http://localhost:8080/api/category'

    constructor(private httpClient: HttpClient){
        
    }

    //productCategoryList(): Observable<ProductCategory[]>{
   //     return this.httpClient.get<GetResponseProductCategory>(this.baseUrl).pipe(
   //         tap((response: any) => console.log('Respuesta backend:', response)),
   //         map(response => response._embedded.productCategories)
   //     )
    //}

    productCategoryList(): Observable<ProductCategory[]>{
        return this.httpClient.get<ProductCategory[]>(this.baseUrl);
    }

    findProductCategoryById(id: number): Observable<ProductCategory>{
        return this.httpClient.get<ProductCategory>(`${this.baseUrl}/${id}`)
    }

    saveProduct(productCategory: ProductCategory): Observable<ProductCategory>{
        return this.httpClient.post<ProductCategory>(this.baseUrl, productCategory);
    }

    updateProduct(productCategory: ProductCategory): Observable<ProductCategory>{
        return this.httpClient.put<ProductCategory>(`${this.baseUrl}/${productCategory.id}`, productCategory)
    }

    deleteProductCategoryById(id: number): Observable<void>{
        return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
    }

}


//interface GetResponseProductCategory{
//    _embedded: {
//      productCategories: ProductCategory[];
//   }
//}