import vtecxapi from 'vtecxapi' 
import { CommonGetFlag } from './common'

export function getUser() {
	const uid = vtecxapi.uid()
	const email = vtecxapi.getEntry('/' + uid).feed.entry[0].title
	return vtecxapi.getFeed('/staff?staff.staff_email=' + email)
}

let role
export function getRole() {
	return role
}
export function setRole(_role) {
	role = _role
}

// 担当の顧客一覧を取得する
export function getCustomerFromUser(_customer_data, _email) {

	const role = getRole()

	// 管理者と経理担当は全ての顧客が対象
	if (role === '1' || role === '5') {
		return _customer_data.feed.entry
	}

	let array = []
	for (let i = 0, ii = _customer_data.feed.entry.length; i < ii; ++i) {
		const entry = _customer_data.feed.entry[i]
		let isPush = false
		// 営業担当検索
		if (entry.customer.sales_staff) {
			entry.customer.sales_staff.map((_value) => {
				if (_value.staff_email === _email) {
					array.push(entry)
					isPush = true
				}
			})
		}
		if (!isPush) {
			// 作業担当検索
			if (entry.customer.working_staff) {
				entry.customer.working_staff.map((_value) => {
					if (_value.staff_email === _email) {
						array.push(entry)
					}
				})
			}
		}
	}
	return array.length ? array : false
}

export function getCustomer(_option) {

	const staff_data = getUser()
	const isStaff = CommonGetFlag(staff_data)

	if (isStaff) {

		setRole(staff_data.feed.entry[0].staff.role)
		const option = _option ? _option : ''
		const email = staff_data.feed.entry[0].staff.staff_email
		const customer_data = vtecxapi.getFeed('/customer' + option, true)
		const isCustomer = CommonGetFlag(customer_data)

		if (isCustomer) {

			return getCustomerFromUser(customer_data, email)

		} else {
			return null
		}
	} else {
		return null
	}
}

/**
 * ログイン者が担当する以下のデータを一覧で取得する
 *   ・見積書
 *   ・請求先
 *   ・顧客
 * @param {*} _type quotation or billto or customer
 */
export function getData(_type) {

	const isCount = vtecxapi.getQueryString('c') === ''

	const doResponse = (_count, _entry) => {
		if (isCount) {
			if (_count) {
				return { feed: { title: '' + _count } }
			} else {
				return { feed: { title: '0' } }
			}
		} else {
			if (_entry) {
				return { feed: { entry: _entry } }
			} else {
				return null
			}
		}
	}

	let customerFromUser
	if (_type === 'customer') {
		customerFromUser = true
	} else {
		customerFromUser = getCustomer()
	}
	const role = getRole()

	if (customerFromUser) {

		let queryString = vtecxapi.getQueryString().split('&')

		// 検索オプションから「n」や「l」などを削除
		// その他のパラメータは検索条件なので削除しない
		queryString = queryString.map((_value) => {
			const name = _value.split('=')[0]
			if (name === 'n' || name === 'l' || name === '_pagination' || name === 'c') {
				return ''
			} else {
				return '&' + _value
			}
		}).join('')

		let total_array = []
		let cashBilltoCode = {}

		let n = vtecxapi.getQueryString('n')
		let l = vtecxapi.getQueryString('l')
		let start_size
		let end_size

		if (l && n) {
			n = parseInt(n)
			l = parseInt(l)
			start_size = n - 1
			start_size = start_size * l
			end_size = n * l
		}

		if (_type === 'customer') {

			// 顧客の場合
			total_array = getCustomer('?f' + queryString)

		} else if (_type === 'inquiry' || _type === 'internal_work') {

			// 管理者と経理担当は全てのデータが対象
			if (role === '1' || role === '5') {
				const uri = '/'+ _type +'?f' + queryString
				const data = vtecxapi.getFeed(uri, true)
				const isData = CommonGetFlag(data)
				if (isData) {
					total_array = data.feed.entry
				}
			} else {
				// 問い合わせの場合
				for (let i = 0, ii = customerFromUser.length; i < ii; ++i) {

					const customer_code = customerFromUser[i].customer.customer_code

					// 顧客単位で問い合わせ検索
					const uri = '/'+ _type +'?customer.customer_code=' + customer_code + queryString
					const data = vtecxapi.getFeed(uri, true)

					const isData = CommonGetFlag(data)
					if (isData) {
						// 検索結果マージ
						Array.prototype.push.apply(total_array, data.feed.entry)
					}

					// 検索の最大件数になったらループを中止
					if (end_size && end_size < total_array) {
						break
					}

				}
			}
		} else {

			const setCleanData = (_data) => {
				if (queryString.indexOf('quotation_code_sub') !== -1) {
					return _data
				} 
				// 見積書一覧の場合、最新枝番のみ抽出する
				if (_type === 'quotation') {
					let res = { feed: { entry: [] } }
					let cash_quotation = {}
					_data.feed.entry.map((_entry) => {
						const quotation_code = _entry.quotation.quotation_code
						if (cash_quotation[quotation_code]) {
							const befor_sub_code = parseInt(cash_quotation[quotation_code].quotation.quotation_code_sub)
							if (befor_sub_code < parseInt(_entry.quotation.quotation_code_sub)) {
								cash_quotation[quotation_code] = _entry
							}
						} else[
							cash_quotation[quotation_code] = _entry
						]
					})
					Object.keys(cash_quotation).forEach((_key) => {
						res.feed.entry.push(cash_quotation[_key])
					})
					return res
				} else {
					return _data
				}
			}
			// 管理者と経理担当は全てのデータが対象
			if (role === '1' || role === '5') {
				const uri = '/'+ _type +'?f' + queryString
				const data = vtecxapi.getFeed(uri, true)
				const isData = CommonGetFlag(data)
				if (isData) {
					total_array = setCleanData(data).feed.entry
				}
			} else {
				// 見積書 or 請求先 or 請求書の場合
				for (let i = 0, ii = customerFromUser.length; i < ii; ++i) {

					const billto_code = customerFromUser[i].billto.billto_code

					if (!cashBilltoCode[billto_code]) {

						// すでに一度検索した請求先コードは再検索しない
						cashBilltoCode[billto_code] = true

						// 請求先単位で見積書検索
						const uri = '/' + _type + '?billto.billto_code=' + billto_code + queryString
						const data = vtecxapi.getFeed(uri, true)

						const isData = CommonGetFlag(data)
						if (isData) {
							// 検索結果マージ
							const cleanData = setCleanData(data)
							Array.prototype.push.apply(total_array, cleanData.feed.entry)
						}

						// 検索の最大件数になったらループを中止
						if (end_size && end_size < total_array) {
							break
						}
					}
				}
			}
		}

		if (total_array && total_array.length) {

			let res_array
			if (end_size) {
				// ページネーション対応
				res_array = []
				for (let i = start_size, ii = end_size; i < ii; ++i) {
					if (total_array[i]) {
						res_array.push(total_array[i])
					} else {
						break
					}
				}
			} else {
				res_array = total_array
			}
			return doResponse(total_array.length, res_array)

		} else {
			return doResponse()
		}

	} else {
		return doResponse()
	}

}
