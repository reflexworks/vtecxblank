import vtecxapi from 'vtecxapi' 
import { getCustomerByShipper } from './put-billing'

const customer_all = vtecxapi.getFeed('/customer',true)
const shipper_code = vtecxapi.getQueryString('shipper_code') 

const customer = getCustomerByShipper(customer_all, shipper_code)
vtecxapi.sendMessage('200', customer.customer_code)
