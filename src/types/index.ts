export interface PreorderComicInterface {
    id?: string;
    slug?: string;
    title?: string;
    publisher?: PublisherInterface;
    description?: string;
    image?: string;
    price_usd?: number;
}

export interface PublisherInterface {
    name?: string;
    slug?: string;
}

export class PreorderComic implements PreorderComicInterface {
    public id?: string;
    public slug?: string;
    public title?: string;
    public publisher?: PublisherInterface;
    public description?: string;
    public image?: string;
    public price_usd?: number;

    public constructor(
        id?: string,
        slug?: string,
        title?: string,
        publisher?: PublisherInterface,
        description?: string,
        image?: string,
        price_usd?: number
    ) {
        this.id = id;
        this.slug = slug;
        this.title = title;
        this.description = description;
        this.image = image;
        this.price_usd = price_usd;
        this.publisher = publisher;
    }
}


export interface CartItemInterface {
    product: PreorderComic;
    quantity: number;
    price: number;
    product_type: string;
    added_at: any;
}

export class CartItem implements CartItemInterface {
    public product: PreorderComic;
    public quantity: number;
    public price: number;
    public product_type: string;
    public added_at: any;

    public constructor(
        product: PreorderComic,
        price: number,
        product_type: string,
        added_at: any,
        quantity: number = 1
    ) {
        this.product = product;
        this.quantity = quantity;
        this.price = price;
        this.product_type = product_type;
        this.added_at = added_at;
    }
}

export class Cart {
    public items: CartItem[];

    public constructor(items: CartItem[] = []) {
        this.items = items;
    }
}
