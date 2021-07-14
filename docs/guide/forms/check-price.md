# Check Price

ADempiere allows a product price search to be carried out through its barcode, in the "**Check Price**" window. For this, the creation and configuration of the user "**Viewer**" was carried out, in order that it can make a quick query of the products with their respective prices.

The price viewer can be configured in currency "**VES**", to reflect the price of the product in bolivars and its amount converted into dollars, according to the exchange rate of the day. It can also be configured with currency "**USD**", to reflect the price of the product in dollars and its amount converted into bolivars, according to the exchange rate of the day.

<img :src="$withBase('/images/forms/check-price/ui-version-check-price.png')" alt="Check Price in Mobile and Desktop Version" width="800px">

## Where it is located?

It is located in position number five (5), in the ADempiere menu. In addition to this, the viewer can also be accessed by selecting the "**Sales Orders**" folder and finally, selecting the "**Check Price**" form.

## What is it for?

It is used to consult the prices of the products in a specific currency and their price converted into another currency, depending on the configuration of the service.

## Functions or Observations

::: tip
The price viewer can be configured in currency "**VES**", to reflect the price of the product in bolivars and its amount converted into dollars, according to the exchange rate of the day. It can also be configured with currency "**USD**", to reflect the price of the product in dollars and its amount converted into bolivars, according to the exchange rate of the day.
:::

## How is it used in the Desktop version?

### Activate Price Consultant

Select in the ADempiere menu, the form "**Check Price**". Then you can view the form window where the barcode should be loaded, this information is loaded into the form with the help of the reader. Finally, you can view product information as follows, where the following fields are detailed:

    - Name
    - Description
    - Base price
    - Tax
    - Total amount
    - Total Amount Converted

<img :src="$withBase('/images/forms/check-price/activate-price-consultant-in-desktop-version.gif')" />

### Deactivate Price Consultant

To deactivate the "**Price Viewer**" mode, you must select the ADempiere icon, it is located in the upper right part of the window. Subsequently, the user's profile must be accessed by selecting the company name. Once located in the window "**Profile**", you must select the tab "**Configuration**" and activate the check "**Enable Tags-View**", and "**Show Menu**" .

<img :src="$withBase('/images/forms/check-price/disable-price-consultant-in-desktop-version.gif')" />

## How is it used in the mobile version?

### Activate Price Consultant

Select in the ADempiere menu, the form "**Check Price**". Then you can view the form window where the barcode should be loaded, this information is loaded into the form with the help of the reader. Finally, you can view product information as follows, where the following fields are detailed:

    - Name
    - Description
    - Base price
    - Tax
    - Total amount
    - Total Amount Converted

<img :src="$withBase('/images/forms/check-price/activate-price-consultant-in-the-mobile-version.gif')" />

### Deactivate Price Consultant

To deactivate the "**Price Viewer**" mode, you must select the ADempiere icon, it is located in the upper right part of the window. Subsequently, the user's profile must be accessed by selecting the company name. Once located in the window "**Profile**", you must select the tab "**Configuration**" and activate the check "**Enable Tags-View**", and "**Show Menu**" .

<img :src="$withBase('/images/forms/check-price/disable-price-consultant-in-mobile-version.gif')" />
