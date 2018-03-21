 #!/bin/bash

curl -H "Authorization: Token "$1 "$2/s/getfeednoid?q=customer&x" -o data/customer.xml
curl -H "Authorization: Token "$1 "$2/s/getfeedofdeliverycharge?x" -o data/deliverycharge.xml
curl -H "Authorization: Token "$1 "$2/s/getfeednoid?q=billfrom&x" -o data/billfrom.xml
curl -H "Authorization: Token "$1 "$2/s/getfeednoid?q=billto&x" -o data/billto.xml
curl -H "Authorization: Token "$1 "$2/s/getfeednoid?q=deliverycharge_template&x" -o data/deliverycharge_template.xml
curl -H "Authorization: Token "$1 "$2/s/getfeednoid?q=packing_item_template&x" -o data/packing_item_template.xml
curl -H "Authorization: Token "$1 "$2/s/getfeednoid?q=packing_item&x" -o data/packing_item.xml
curl -H "Authorization: Token "$1 "$2/s/getfeednoid?q=shipment_service&x" -o data/shipment_service.xml
curl -H "Authorization: Token "$1 "$2/s/getfeednoid?q=staff&x" -o data/staff.xml
curl -H "Authorization: Token "$1 "$2/s/getfeednoid?q=warehouse&x" -o data/warehouse.xml
curl -H "Authorization: Token "$1 "$2/s/getfeednoid?q=quotation&x" -o data/quotation.xml
curl -H "Authorization: Token "$1 "$2/s/getfeednoid?q=type_ahead&x" -o data/type_ahead.xml
curl -H "Authorization: Token "$1 "$2/s/getfeedofinternalworklist?x" -o data/internal_work.xml

#internal_work
