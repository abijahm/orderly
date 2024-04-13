# Orderly
> Goal of this project is to explore a solution for order management.

In this context an **Order** is a request by a customer or on behalf of a customer to acquire goods or services.
Orders will encapsulate Order line items which will be a list of Orderable items and their attributes e.g. price an orderable item can be anything from a product to a Subscription plan these can also include business rules to calculate the final prices after discounts. It should be possible to extend the functionality of an order through plugins, these can be used to handle different types of orderable items or calling an external payment gateway and awaiting for the callback request or even notifying an external system the order has completed and the user can be allowed to access a service.
