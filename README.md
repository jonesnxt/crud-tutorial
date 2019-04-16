# CRUD - Basic Template
Hello Developer!
This template exists to show how you can use our SDK to make simple
datastore CRUD functionality in your code.

The KOJI datastore is a object based store with keys identifying the object placed.
You are responsible for giving your objects keys to use, in this case we'll use the `uuid`
package from npm and specifically use the `uuid.v4();` function in your code to generate a unique key.

We've also included the [Jiro SDK](https://github.com/madewithjiro/jiro-sdk) for accessing
the datastore.

## What to learn

The interesting code here is all in the `/backend` directory.
The javascript used in the `/frontend` is simple enough to follow for this example,
but you'll probably end up using a better XHR library because you're a good developer :)

### /backend/server.js
Open up the `backend/server.js` file in your editor and we'll have a look at a few pieces
of code in there that are important to making your CRUD functions work with our
provided database.

All your code needs to use the datastore is:

```javascript
import Jiro from '@madewithjiro/jiro-sdk';
const { Store } = new Jiro();
```

And then in example *expressJS* endpoints for **/data** and **/data/:id** You'll see the usage of it like this:

```javascript
Store.get('baseDB', id?);
Store.set('baseDB', uuid.v4(), value);
```

A List of all the Store functions is in the [Jiro SDK repository](https://github.com/MadeWithJiro/jiro-sdk/blob/master/src/store/JiroStoreAdapter.ts)

Happy coding and contact us if you have any more questions about using the Datastore!

[support@gometa.io](mailto:support@gometa.io)

