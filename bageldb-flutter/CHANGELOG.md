# 0.0.1

- The initial version.

# 0.1.0

- Add an example in `example` directory
- Add more descriptive README
- Add more documantation to the functions

# 0.1.1

- API & example editing

# 0.1.2

- Add longer description

# 0.1.3

- Edit the contructor of `BagelDB` object
- Add a link to a detailes example repo on Github

# 0.1.4

- Add `pageNumber` query
- Internal changes in the endpoints

# 0.1.6

- Added nullsafety to the package
- Added method `schema` to retrieve the collection schema

# 0.1.7

- Added support for all platforms: Android, IOS and Web
- Added Support for nested collection for all CRUD operations
- Added field projection for all requests
- Bug Fixes

# 0.1.8

- Added support for appending or unsetting an item to a reference list instead of putting the entire array
- Added Support for flutter web

# 0.1.9

- validate `set()` and `post()` methods item is set
- solidify `query()` and other methods return the right types

# 0.1.10

- Breaking Change: `put()`, `set()` and `post()` do not take named parameters anymore, the Map is received is now a positional argument

# 0.1.11

- Bug fixes with nested collection request

# 0.1.12

- Added `data` parameter to the `listen()` method, now returning the full payload, allowing listen to be used as a `get()` and get properly updated when data changes

# 0.1.13

- `listen()` stability bug fix
- fixed `itemCount` bug on `get()`

# 0.1.14

- Realtime payload bug fix

# 0.1.15

- Realtime nested collection bug fix

# 0.1.16

- User authentication is now available in the flutter library.
- OTP is also available via the new `requestOtp(emailOrPhone)` then `validateOtp(otp)` methods.

# 0.1.17

- Otp bug fix, now throwing an error for the wrong password

# 0.1.18

- GeoPoint query static constructor
- Minor OTP bug fix

# 0.1.19

- Changes to how user login state is managed, bug fixes
- deprecated `getUserID()` `isLoggedIn()` and `getUser()` in favor of getter `user`
- Added `authStateChange` as a Stream to get notified on a users login state change

# 0.1.20

- BagelUser and AuthEvent export fix
- Change user getter to type BagelUser?
- Fixed listner initialization for veirfy functions

# 0.1.21

- Initialization bug fix

# 0.1.22

- Better error handling
- Instance consistancy for `users()`
- `authStateChange` bug fixes - wont add events after closing, and propely re-instatiate when opening again
