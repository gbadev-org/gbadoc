# gbadoc

Community initiated GBA Technical documentation effort.

We're currently defining requisites. Check [Issues](https://github.com/gbdev/gbadoc/issues/) and join the `#documentation` chat channel on the [gbadev](https://discord.io/gbadev) discord.

## Building The Book

The book is written in markdown and compiled to HTML using [mdbook][mdb-gh].
It's a tool written in Rust, but you do *not* have to have Rust installed to use it.
There are [pre-built binaries][mdb-bins] available.

[mdb-gh]: https://github.com/rust-lang/mdBook

[mdb-bins]: https://github.com/rust-lang/mdBook/releases

Basic usage:

* `mdbook serve`: builds the book and serves it at `http://localhost:3000`.
This will continue to watch the files while it's serving.
Any changes on disk will automatically trigger a new build,
and you'll see the changes just by refreshing your browser.
* `mdbook serve --open`: as above, but this also opens a browser tab to the correct URL for you.
