 #!/bin/bash

curl -H "Authorization: Token "$2 "$1/s/get-feed-noid?q=customer&x" -o data/customer.xml
curl -H "Authorization: Token "$2 "$1/s/get-feed-deliverycharge?x" -o data/deliverycharge.xml
curl -H "Authorization: Token "$2 "$1/s/get-feed-noid?q=billfrom&x" -o data/billfrom.xml
curl -H "Authorization: Token "$2 "$1/s/get-feed-noid?q=billto&x" -o data/billto.xml
curl -H "Authorization: Token "$2 "$1/s/get-feed-noid?q=deliverycharge_template&x" -o data/deliverycharge_template.xml
curl -H "Authorization: Token "$2 "$1/s/get-feed-noid?q=packing_item_template&x" -o data/packing_item_template.xml
curl -H "Authorization: Token "$2 "$1/s/get-feed-noid?q=packing_item&x" -o data/packing_item.xml
curl -H "Authorization: Token "$2 "$1/s/get-feed-noid?q=shipment_service&x" -o data/shipment_service.xml
curl -H "Authorization: Token "$2 "$1/s/get-feed-noid?q=staff&x" -o data/staff.xml
curl -H "Authorization: Token "$2 "$1/s/get-feed-noid?q=warehouse&x" -o data/warehouse.xml
curl -H "Authorization: Token "$2 "$1/s/get-feed-noid?q=quotation&x" -o data/quotation.xml
curl -H "Authorization: Token "$2 "$1/s/get-feed-noid?q=type_ahead&x" -o data/type_ahead.xml
curl -H "Authorization: Token "$2 "$1/s/get-feed-internalwork-list?x" -o data/internal_work.xml
curl -H "Authorization: Token "$2 "$1/s/get-feed-noid?q=inquiry&x" -o data/inquiry.xml

#curl -H "Authorization: Token "$2 "$1/d/type_ahead?type_ahead.type=0&f&x&_nometa&l=*" -o data/type_ahead.xml

#internal_work
