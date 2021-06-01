# Point of sale

The point of sale form allows salespeople to take customer orders quickly and efficiently. During the process, the total amount of the order can be viewed, converted into the different currencies with which the organization works, for this there must necessarily be a previously created exchange rate.

## Create New Order

A new sales order record can be created by adding a product to the form.

<img :src="$withBase('/images/forms/point-of-sales/create-new-order.gif')" />

Similarly, a new record can be created by selecting the option "**New Order**", located on the right side of the "**Business Partner**" field. This option is enabled when the user is positioned in a sales order record, in the form "**Point of Sale**".

<img :src="$withBase('/images/forms/point-of-sales/option-create-new-order.png')" alt="Create New Order Option" width="800px">

## Add Customer to an Order

To add a customer to a sales order, the customer's data must be entered in the "**Business Partner**" field.

<img :src="$withBase('/images/forms/point-of-sales/add-business-partner.gif')" />

Additionally, a new record of a client business partner can be created by selecting the "**+**" icon, located at the top of the "**Business Partner**" field.

<img :src="$withBase('/images/forms/point-of-sales/create-business-partner.png')" alt="Create Business Partner" width="800px">

## Add Product to an Order

The products of the sales order can be added to it as follows:

- Entering the code or name of the product in the field "**Product Code**". When entering a value in this field, ADempiere performs the search automatically, displaying the results below the field.

<img :src="$withBase('/images/forms/point-of-sales/add-product-with-code-or-name.gif')" />

- Selecting the products in the product catalog that is displayed by selecting the "**<**" icon, located in the central right part of the "**Point of Sale**" form window.

<img :src="$withBase('/images/forms/point-of-sales/add-product-with-catalog.gif')" />

- In addition to this, the products can be added with the help of the barcode reader.

<img :src="$withBase('/images/forms/point-of-sales/add-product-with-code-reader.gif')" />

## Order Lines

<img :src="$withBase('/images/forms/point-of-sales/sales-order-lines.png')" alt="Sales Order Lines" width="800px">

The order lines section contains the following six (6) columns that represent the main fields of the product:

- **Product**: Name of the product loaded to the sales order.

- **Price**: Unit price of the product charged to the sales order.

- **Quantity**: The quantity of the product loaded to the sales order.

- **% Discount**: The discount percentage applied to the price of the product charged to the sales order.

- **Total**: The total of the product line, according to the amount entered.

- **Options**: The column consists of three (3) options that allow the user to perform certain actions

  - The first option from left to right, allows you to view the product information

  - The second option from left to right, allows you to modify the quantity, price and discount percentage of the product.

  - The third option from left to right, allows you to delete the record of the sales order line.

    <img :src="$withBase('/images/forms/point-of-sales/sales-order-lines.gif')" />

## Order Information

The information of the sales order is located in the lower right part of the form. It is made up of the following fields:

- **Order**: Indicates the document number of the sales order.

- **Seller**: Indicates the name of the commercial agent (seller) who is placing the sale order.

- **Date**: Indicates the date of the sale order.

- **Sub-Total**: Indicates the total amount of the order without taxes.

- **Type**: Indicates the type of document with which the sales order is being generated.

- **Discount**: Indicates the total amount of the discount applied to the order.

- **Item Quantity**: Indicates the total quantity of items that the sales order has.

- **Tax**: Indicates the total amount of tax applied to the order.

- **Number of Lines**: Indicates the total number of product lines that the sales order has.

- **Total**: Indicates the total amount of the order with discount and taxes.

<img :src="$withBase('/images/forms/point-of-sales/sales-order-information.png')" alt="Sales Order Information" width="800px">

## Point of Sale Options

To position yourself in any product line of the order you are placing, you can click on it or select the "**Positioning**" icons located at the bottom left of the "**Point of Sale**" form. . Where the first icon allows positioning in the "**Previous Record**", and the second icon allows positioning in the "**Next Record**".

<img :src="$withBase('/images/forms/point-of-sales/position-yourself-on-the-order-lines.gif')" />

In the same way, you can delete the product record where it is located, by selecting the "**Delete**" icon located at the bottom left of the "**Point of Sale**" form.

<img :src="$withBase('/images/forms/point-of-sales/remove-the-order-line.gif')" />

Select the icon "**Charge**", to collect the sales order that you are carrying out.

<img :src="$withBase('/images/forms/point-of-sales/collect-the-order.gif')" />

To change the POS terminal in the point of sale form, select the option "**Point of Sale**" located at the bottom left of the form. Then, select the POS terminal with which you need to carry out the sales operations.

<img :src="$withBase('/images/forms/point-of-sales/change-point-of-sale-terminal.gif')" />
