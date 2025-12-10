import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();


  constructor(){

  }

  addToCart(theCartItem: CartItem){

    let existingCartItem: CartItem | undefined; 
    let alreadyExitsInCart: boolean = false;

    if (this.cartItems.length > 0){
      // Asignación: Ahora es válida, ya que el tipo es CartItem | undefined
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);

      // Verificación: Comprueba si se encontró el elemento
      alreadyExitsInCart = (existingCartItem !== undefined);
    }

    if (existingCartItem){ // TypeScript ahora sabe que aquí existingCartItem es definitivamente CartItem
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(theCartItem);
    }



    this.computeCartTotals();
  }

  computeCartTotals(){
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number){
    for (let tempCartItem of this.cartItems){
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
    }
  }

}
