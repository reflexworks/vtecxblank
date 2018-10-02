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
        content?: Content[],
        link?: Link[],
        contributor?: Contributor[],
        userinfo?: Userinfo,
        favorite?: Favorite,
        hobby?: Hobby[],
        account?: Account
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
    interface Userinfo {
        id?: string,
        email?: string,
        name?: string
    }
    interface Favorite {
        food?: string,
        music?: string
    }
    interface Hobby {
        type?: string,
        name?: string,
        updated?: string
    }
    interface Account {
        firstname?: string,
        lastname?: string,
        tel?: string,
        prefecture_code?: string,
        address1?: string,
        address2?: string,
        email?: string,
        postcode?: string
    }
}