module escapade::crutokens {
    use std::option;
    use sui::transfer;
    use sui::object::{Self, UID};
    use sui::coin::{Self, TreasuryCap};
    use sui::tx_context::{Self, TxContext};

    use sui::token::{Self, ActionRequest, Token};

    const EIncorrectAmount: u64 = 0;

    const WINE_PRICE: u64 = 1;

    struct CRUTOKENS has drop {}

    struct WineShop has drop {}

    struct Freebie has key, store {
        id: UID
    }

    fun init(otw: CRUTOKENS, ctx: &mut TxContext) {
        let (treasury_cap, coin_metadata) = coin::create_currency(
            otw,
            0, // no decimals
            b"CRU", // symbol
            b"Cru Token", // name
            b"Token for Cru Wine Bar", // description
            option::none(), // url
            ctx
        );

        let (policy, policy_cap) = token::new_policy(&treasury_cap, ctx);

        // but we constrain spend by this shop:
        token::add_rule_for_action<CRUTOKENS, WineShop>(
            &mut policy,
            &policy_cap,
            token::spend_action(),
            ctx
        );

        token::share_policy(policy);

        transfer::public_freeze_object(coin_metadata);
        transfer::public_transfer(policy_cap, tx_context::sender(ctx));
        transfer::public_transfer(treasury_cap, tx_context::sender(ctx));
    }


    public fun sendTokens(
        cap: &mut TreasuryCap<CRUTOKENS>,
        amount: u64,
        recipient: address,
        ctx: &mut TxContext
    ) {
        let token = token::mint(cap, amount, ctx);
        let req = token::transfer(token, recipient, ctx);

        token::confirm_with_treasury_cap(cap, req, ctx);
    }

    public fun redeemTokens(
        token: Token<CRUTOKENS>,
        ctx: &mut TxContext
    ): (Freebie, ActionRequest<CRUTOKENS>) {
        assert!(token::value(&token) == WINE_PRICE, EIncorrectAmount);

        let gift = Freebie { id: object::new(ctx) };
        let req = token::spend(token, ctx);

        // only required because we've set this rule
        token::add_approval(WineShop {}, &mut req, ctx);

        (gift, req)
    }
}