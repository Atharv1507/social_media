# 03 — Password Hashing with bcrypt

## Core implementation

Registration uses:

```js
const salt = await bcrypt.genSalt(10)
const hashedPassword = await bcrypt.hash(password, salt)
```

Then the database receives:

```js
password: hashedPassword
```

The raw password should never be persisted.

## Salt

Conceptually:

```text
password + random salt
       ↓
bcrypt
       ↓
hash
```

A salt makes equal passwords independently represented in storage.

## Cost factor

The repo uses `genSalt(10)`. The cost controls computational effort. Higher cost increases work for password guessing but also consumes server resources.

## Hashing vs encryption

Hashing is verification-oriented:

```text
password → hash
```

Encryption is reversible with a key:

```text
plaintext → ciphertext → plaintext
```

That is why login uses:

```js
bcrypt.compare(password, user.password)
```

instead of decrypting anything.

## What bcrypt does not solve

Password hashing does not automatically solve rate limiting, phishing, CSRF, session theft, XSS or weak account recovery. It solves secure password-at-rest storage.

## Debugging

If every login fails, inspect a stored user record. The password field should look like a bcrypt hash, not the original password.

## Viva

1. What is a salt?
2. Why does bcrypt have a cost factor?
3. Hashing vs encryption?
4. Why use bcrypt.compare?
5. What security controls are still required?