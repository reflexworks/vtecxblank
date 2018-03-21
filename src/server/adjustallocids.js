import vtecxapi from 'vtecxapi' 

const customer = vtecxapi.getFeed('/customer', true)
let num = Number(customer.feed.entry[customer.feed.entry.length - 1].id.split(',')[0].replace(/[^0-9^\\.]/g,'')) + 1
vtecxapi.setids('/customer',num)

const billfrom = vtecxapi.getFeed('/billfrom', true)
num = Number(billfrom.feed.entry[billfrom.feed.entry.length-1].id.split(',')[0].replace(/[^0-9^\\.]/g,''))+1
vtecxapi.setids('/billfrom',num)

const billto = vtecxapi.getFeed('/billto', true)
num = Number(billto.feed.entry[billto.feed.entry.length-1].id.split(',')[0].replace(/[^0-9^\\.]/g,''))+1
vtecxapi.setids('/billto',num)

const warehouse = vtecxapi.getFeed('/warehouse', true)
num = Number(warehouse.feed.entry[warehouse.feed.entry.length-1].id.split(',')[0].replace(/[^0-9^\\.]/g,''))+1
vtecxapi.setids('/warehouse',num)

const quotation = vtecxapi.getFeed('/quotation', true)
num = Number(quotation.feed.entry[quotation.feed.entry.length-1].id.split('-')[0].replace(/[^0-9^\\.]/g,''))+1
vtecxapi.setids('/quotation',num)

vtecxapi.sendMessage(200, 'counters are updated.')
