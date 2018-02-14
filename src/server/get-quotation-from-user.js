import vtecxapi from 'vtecxapi' 
import { CommonGetFlag } from './common'

export function getQuotation() {

	const uid = vtecxapi.uid()
	const email = vtecxapi.getEntry('/' + uid).feed.entry[0].title
	const role = vtecxapi.getFeed('/staff?staff.staff_email=' + email).feed.entry[0].staff.role

	const isCount = vtecxapi.getQueryString('c') === ''

	const customer_data = vtecxapi.getFeed('/customer', true)
	const isCustomer = CommonGetFlag(customer_data)

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

	if (isCustomer) {

		// 担当の顧客一覧を取得する
		const getCustomerFromUser = () => {
			let array = []
			for (let i = 0, ii = customer_data.feed.entry.length; i < ii; ++i) {
				const entry = customer_data.feed.entry[i]
				let isPush = false
				// 営業担当検索
				if (entry.customer.sales_staff) {
					entry.customer.sales_staff.map((_value) => {
						if (_value.staff_email === email) {
							array.push(entry)
							isPush = true
						}
					})
				}
				if (!isPush) {
					// 作業担当検索
					if (entry.customer.working_staff) {
						entry.customer.working_staff.map((_value) => {
							if (_value.staff_email === email) {
								array.push(entry)
							}
						})
					}
				}
			}
			return array.length ? array : false
		}
		let customerFromUser
		// 管理者と経理担当は全ての顧客が対象
		if (role === '1' || role === '5') {
			customerFromUser = customer_data.feed.entry
		} else {
			customerFromUser = getCustomerFromUser()
		}

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

			for (let i = 0, ii = customerFromUser.length; i < ii; ++i) {

				const billto_code = customerFromUser[i].billto.billto_code

				if (!cashBilltoCode[billto_code]) {

					// すでに一度検索した請求先コードは再検索しない
					cashBilltoCode[billto_code] = true

					// 請求先単位で見積書検索
					const uri = '/quotation?billto.billto_code=' + billto_code + queryString
					const quotation_data = vtecxapi.getFeed(uri, true)

					const isQuotation = CommonGetFlag(quotation_data)
					if (isQuotation) {
						// 検索結果マージ
						Array.prototype.push.apply(total_array, quotation_data.feed.entry)
					}

					// 検索の最大件数になったらループを中止
					if (end_size && end_size < total_array) {
						break
					}
				}
			}

			if (total_array.length) {

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
				}
				return doResponse(total_array.length, res_array)

			} else {
				return doResponse()
			}

		} else {
			return doResponse()
		}
	} else {
		return doResponse()
	}
}
