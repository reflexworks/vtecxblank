export = VtecxApp
export as namespace VtecxApp

declare namespace VtecxApp {
	interface Request {
		feed: Feed
	}
	interface Feed {
		entry: Entry[]
	}
	interface Entry {
		id?: string,
		title?: string,
		subtitle?: string,
		rights?: string,
		summary?: string,
		content?: Content[],
		link?: Link[],
		contributor?: Contributor[],
		foo?:Foo
	}
	interface Content {
		______text: string
	}
	interface Link {
		___href: string,
		___rel: string
	}
	interface Contributor {
		uri?: string,
		email?: string
	}
	interface Foo {
		bar?:string
	}
}