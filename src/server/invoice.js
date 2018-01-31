import reflexcontext from 'reflexcontext' 

const resData = {
	'feed': {
		'entry': []
	}
}

const item_details = [{
	category: 'monthly',
	item_name: '保管料',
	quantity: '4',
	unit: '1坪 / 月',
	unit_price: '¥5,000',
	remarks: '棚、ラックリース(新品:500円 / 中古品:300円)支給品利用可能',
}, {
	category: 'monthly',	
	item_name: '保管料',
	quantity: '4',
	unit: '1パレット / 月',
	unit_price: '¥2,500',
	remarks: 'サイズ1,100×1,100',
}, {
	category: 'monthly',	
	item_name: '保管料',
	quantity: '4',
	unit: '1パレット / 月',
	unit_price: '¥2,500',
	remarks: 'パレットラック縦積み',
}, {
	category: 'monthly',	
	item_name: '運営管理費',
	quantity: '',
	unit: 'データ変換ソフト / 月額',
	unit_price: '¥10,000',
	remarks: 'ご希望に応じて',
}, {
	category: 'monthly',
	item_name: '運営管理費',
	quantity: '',
	unit: '月額',
	unit_price: '¥35,000',
	remarks: '専属窓口1名、在庫報告、システム保守、WMSが必要な場合別途相談',
}, {
	category: 'daily',
	item_name: '入庫作業料',
	quantity: '4',
	unit: '入庫量 / 1点',
	unit_price: '¥10~30',
	remarks: 'バラ、アソート入庫、外装検品、品番確認、数量検品、棚格納',
}, {
	category: 'daily',	
	item_name: '入庫作業料',
	quantity: '4',
	unit: '入庫量 / 1箱',
	unit_price: '¥50',
	remarks: '外装検品、品番確認、内容未見、箱積み',
}, {
	category: 'daily',
	item_name: '入庫作業料',
	quantity: '4',
	unit: 'デバンニング / 20F',
	unit_price: '¥18,000',
	remarks: 'ハイキューブ＋¥3,000',
}, {
	category: 'daily',
	item_name: '入庫作業料',
	quantity: '4',
	unit: 'デバンニング / 40F',
	unit_price: '¥33,000',
	remarks: 'ハイキューブ＋¥3,000',
}, {
	category: 'daily',
	item_name: '出荷作業料',
	quantity: '4',
	unit: 'DM便・ネコポス・ゆうパケット・ゆうメール・定形外 / 1封緘',
	unit_price: '¥200',
	remarks: '',
}, {
	category: 'daily',
	item_name: '出荷作業料',
	quantity: '4',
	unit: '宅配便 / 1梱包',
	unit_price: '¥300',
	remarks: '',
}, {
	category: 'daily',
	item_name: '出荷作業料',
	quantity: '4',
	unit: 'ピッキング / 1点',
	unit_price: '¥30',
	remarks: '',
}, {
	category: 'daily',
	item_name: '出荷作業料',
	quantity: '4',
	unit: '同梱作業 / 1枚 / 冊',
	unit_price: '¥10',
	remarks: 'ステッカー、チラシ、カタログ、パンフレットなどの販促物',
}, {
	category: 'daily',
	item_name: '付帯作業料',
	quantity: '4',
	unit: 'エアキャップ巻き / 1点',
	unit_price: '¥15',
	remarks: 'アクセサリー、小物(資材別)',
}, {
	category: 'daily',
	item_name: '付帯作業料',
	quantity: '4',
	unit: 'エアキャップ巻き / 1箱',
	unit_price: '¥50',
	remarks: '(資材別)',
}, {
	category: 'daily',
	item_name: '付帯作業料',
	quantity: '4',
	unit: '簡易包装 / 1箱',
	unit_price: '¥100',
	remarks: 'ラッピング袋などへ詰め込みのみ(資材別)',
}, {
	category: 'daily',
	item_name: '付帯作業料',
	quantity: '4',
	unit: '完全包装 / 1箱',
	unit_price: '¥200',
	remarks: 'ラッピング、ギフト梱包(資材別)',
}, {
	category: 'daily',
	item_name: '付帯作業料',
	quantity: '4',
	unit: '商品品番シール貼り / 1点',
	unit_price: '¥5',
	remarks: 'シール印字・貼り作業(ペーパー代別)',
}, {
	category: 'daily',
	item_name: '付帯作業料',
	quantity: '4',
	unit: 'バーコード作成 / 1KSU',
	unit_price: '¥200',
	remarks: 'JAN登録は行いません',
}, {
	category: 'daily',
	item_name: '実地棚卸作業',
	quantity: '4',
	unit: '人口 / 1時間',
	unit_price: '¥2,500',
	remarks: '必要な場合',
}, {
	category: 'daily',
	item_name: 'イレギュラー処理費用',
	quantity: '4',
	unit: '返品処理 / 1件',
	unit_price: '¥200',
	remarks: '住所不明・長期不在などで返品になった商品の在庫戻し、貴社報告',
}, {
	category: 'packing_item',
	item_name: '資材費(ダンボール3.5cm<大>)',
	quantity: '2,300',
	unit: '枚',
	unit_price: '¥21',
	remarks: '',
}, {
	category: 'packing_item',
	item_name: '資材費(ダンボール160サイズ)',
	quantity: '0',
	unit: 'セット',
	unit_price: '¥767',
	remarks: '',
}, {
	category: 'delivery_charge_shipping',
	item_name: 'エコ配JP',
	quantity: '161',
	unit: '個',
	unit_price: '¥390',
	remarks: '',
}, {
	category: 'delivery_charge_shipping',	
	item_name: 'ヤマト運輸発払',
	quantity: '97',
	unit: '個',
	unit_price: '¥500',
	remarks: '',
}, {
	category: 'delivery_charge_shipping',
	item_name: '佐川急便発払',
	quantity: '32',
	unit: '個',
	unit_price: '¥400',
	remarks: '',
}, {
	category: 'delivery_charge_shipping',
	item_name: '西濃運輸',
	quantity: '144',
	unit: '個',
	unit_price: '¥1,070',
	remarks: '',
}, {
	category: 'delivery_charge_shipping',
	item_name: '自社配送',
	quantity: '180',
	unit: '個',
	unit_price: '¥300',
	remarks: '',
}, {
	category: 'delivery_charge_collecting',
	item_name: 'エコ配JP',
	quantity: '131',
	unit: '個',
	unit_price: '¥390',
	remarks: '',
}, {
	category: 'delivery_charge_collecting',	
	item_name: 'ヤマト運輸発払',
	quantity: '95',
	unit: '個',
	unit_price: '¥500',
	remarks: '',
}, {
	category: 'delivery_charge_collecting',
	item_name: '佐川急便発払',
	quantity: '34',
	unit: '個',
	unit_price: '¥400',
	remarks: '',
}, {
	category: 'delivery_charge_collecting',
	item_name: '西濃運輸',
	quantity: '14',
	unit: '個',
	unit_price: '¥1,070',
	remarks: '',
}, {
	category: 'delivery_charge_collecting',
	item_name: '自社配送',
	quantity: '130',
	unit: '個',
	unit_price: '¥300',
	remarks: '',
}]

let entry = {
	item_details: item_details
}

resData.feed.entry.push(entry)
reflexcontext.doResponse(resData) 