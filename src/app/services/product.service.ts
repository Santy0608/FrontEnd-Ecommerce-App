import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {


  private baseUrl: string = 'http://localhost:8080/api/products';

  constructor(private httpClient: HttpClient){

  }

  getProduct(theProductId: number): Observable<Product>{
    const productUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(productUrl);
  }

  //getProductList(): Observable<Product[]>{
  //  return this.httpClient.get<Product[]>(this.baseUrl);
  //}

  getProductListPaginate(thePage: number, thePageSize: number, theCategoryId: number): Observable<GetResponseProducts>{

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}` 
                        + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductList(theCategoryId: number): Observable<Product[]>{

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.getProducts(searchUrl);
  }

  searchProductsPaginate(thePage: number, thePageSize: number, theKeywordString: string): Observable<GetResponseProducts>{

    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeywordString}` 
                        + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  searchProducts(keyWord: string | null): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyWord}`;

    return this.getProducts(searchUrl)
  }


  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  findProductById(id: number): Observable<Product>{
    return this.httpClient.get<Product>(`${this.baseUrl}/${id}`)
  }

  saveProduct(product: Product): Observable<Product>{
    return this.httpClient.post<Product>(this.baseUrl, product);
  }

  updateProduct(product: Product): Observable<Product>{
    return this.httpClient.put<Product>(`${this.baseUrl}/${product.id}`, product);
  }

  deleteProductById(id: number): Observable<void>{
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }

}

interface GetResponseProducts{
    _embedded: {
      products: Product[];
    }, 
    page: {
      size: number,
      totalElements: number,
      totalPages: number,
      number: number
    }
}
