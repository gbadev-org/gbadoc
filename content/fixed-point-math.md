# Fixed-Point Math for Newbies

You may have come across the term "fixed-point math" before, especially if you're into homebrew. What is fixed-point math, why do we use it, and how does it work?

Fixed-point math is a common workaround for when a piece of hardware doesn't have a floating point unit, or FPU. A floating point unit, in simple terms, is what allows computers to deal with fractional values (such as 1.5) and very large values (such as one quintillion). The data types for these would be "floats" or "doubles". The first major console that was released with an FPU was the Nintendo 64 in 1996, but many consoles that were released after still didn't have one.

The Game Boy Advance was one such device that didn’t have an FPU. If you try to use floats within your code, it will still compile and run, but it will have a major effect on the performance. This is because without an FPU, floats are emulated on the software level, instead of being handled directly by hardware. The code with floats will compile into something much longer.

I'm going to focus on fractional values in this guide, but most of the same principles will apply for very large numbers as well.

Before explaining how fixed-point math actually works, we need some background:

## What’s Binary, and How Do I Count in It?

We humans use a base-10 system of counting, known as "decimal", where digits 0 to 9 are used to construct numbers. Computers use a base-2 system of counting, known as "binary". Binary only uses digits 0 and 1 to construct numbers.

So, how do you count in binary? First, you count up to 1, then you carry over to the next digit, going left. That looks like this:

```c
00000000 // 0
00000001 // 1
00000010 // 2
00000011 // 3
00000100 // 4
00000101 // 5
00000110 // 6
00000111 // 7
00001000 // 8
00001001 // 9
00001010 // 10
00001011 // 11
```

And so on. Try continuing that series yourself, up to 16.

Similar to our human decimal system (at least in English), the rightmost digit is the least significant (only corresponding to 1 or 0), and each digit going left is bigger; in decimal they would correspond to 2 or 0, 4 or 0, 8 or 0, etc. Note that each digit corresponds to an increasing power of 2 (1, 2, 4, 8, 16, 32, 64, 128).

Each digit in binary is referred to as a 'bit'. In the previous example, it's 8 bits of information. This means that it can store 256 (2 to the power of 8) different values before running out of space.

On the GBA, 8 bits is also known as a 'byte'. This is true for most hardware. The byte that is `00001011` is equal to "1 plus 2 plus 8", or 11, because the 1 and 2 and 8 bits are set.

## Bit Shifting

So, let's say we have this number:

```c
00000110 // 6
```

We can "shift" these bits. That means taking the 1's and moving them left or right. The operators for this are usually `<<` for shifting left, and `>>` for shifting right. Just remember where the arrows point, and that will tell you the direction. Left makes it larger, and right makes it smaller.

If we shift left by 1 bit, we get:

```c
00000110 // 6, before
00001100 // 12, after
```

All of the 1's shifted "to the left". Note that this is twice as big; we just multiplied by two. Now let's move 6 right by 1 bit.

```c
00000110 // 6, before
00000011 // 3, after
```

Woah! We shifted it "to the right" and it's half as big; we just divided by two. What if we shift 6 right by 2 bits instead of just 1?

```c
00000110 // 6, before
00000001 // 1, after
```

It looks like we clipped the rightmost digit in this process. 6 divided by 4 is 1.5, but we don't have space for anything to the right of the decimal point, so the .5 part just gets cut off. This leaves us with just 1. In other words, it's 6 divided by 4, rounded down.

## Fractions with Fixed-Point

So, we know binary and we know how to bit shift. But all of the values so far are just integers. When do the fractions come in? Well, they don't actually.

Programmers before us were pretty clever. If all we have to work with are integers, but we need fractions, what do we do? Well, we can just pretend that a portion of the bits are fractional anyway, and that works well enough!

So, let's say we set aside the rightmost 4 bits for a fraction. Now let's try counting again!

```c
00000000 //  0/16
00000001 //  1/16
00000010 //  2/16
00000011 //  3/16
00000100 //  4/16
00000101 //  5/16
00000110 //  6/16
00000111 //  7/16
00001000 //  8/16
00001001 //  9/16
00001010 // 10/16
00001011 // 11/16
```

And so on. These aren’t *actually* 1/16 and so on, but we’re pretending that they are. We dedicated 4 bits here, so we get "2 to the power of 4" as the denominator, and we're counting the numerator just the same as before. Once we hit the 5th bit going left, we've arrived at 1 proper.

Another way to think of it is that the right 4 bits are the "fractional segment", and the left 4 bits are the "integer segment".

If we want to use this for an input that needs a proper integer (instead of a fixed-point representation) then we shift right by 4 bits. This rounds the number down to the nearest integer.

This would typically be referred to as "4.4f fixed-point". 4 bits for the integer, and 4 bits for the fraction. That's assuming it's unsigned (only positive numbers). If we need negative numbers, then we take away one bit (the leftmost) for that, so we would say that it's "signed 3.4f fixed-point".

However, the maximum value here is painfully small. I've been using 8 bits for readability, but usually you’d want the biggest data type available for your system. For the GBA, that would be an `int`, which is 32 bits, or 4 bytes. So if we use 4 bits for the fraction, and it's a signed `int` data type, then that would be "signed 27.4f fixed-point".

## A Practical Example

Let's say we have a player sprite, with an X and Y position. What speed should we move it at? 2 pixels per frame is too fast, but 1 pixel per frame is too slow. Why don’t we try... 1 and 3/8 pixels per frame. This time we're using 3 bits for our fixed-point.

```c
// a function elsewhere in code, which needs the ONSCREEN x and y position
void display_player(int x, int y);

// player coordinates use signed 28.3f fixed-point format
const int player_fp = 3;

// 1 and 5/8, written verbosely for demonstration purposes
int player_speed = (1 << player_fp) + ((5 << player_fp) / 8);

// let's start the player at (5, 6) on the screen
// shift both of these values left to account for the fixed-point
signed int player_x = 5 << player_fp;
signed int player_y = 6 << player_fp;

... // skip ahead to the main game loop

// adjust the player’s position based on input
if key_is_down(KEY_LEFT) {
	player_x -= player_speed;
} else if key_is_down(KEY_RIGHT) {
	player_x += player_speed;
} else if key_is_down(KEY_UP) {
	player_y -= player_speed;
} else if key_is_down(KEY_DOWN) {
	player_y += player_speed;
}

// we need their onscreen x and y position here, not the fixed-point representation
display_player(player_x >> player_fp, player_y >> player_fp);
```

Let's break this down:

First, we declare the number of bits we're using for the fractional denominator. Then, we initialize variables that use that denominator. Next, we work with those variables, until we need its integer component. Finally, we shift right.

**Always comment your fixed-point. Always always always comment.** It will save many headaches, for you and for anyone reading your code.

All player location values here use a signed 28.3 fixed-point format, but other values, such as player health or stamina, could use different fixed-point formats, or they could just avoid fixed-point entirely. It's up to you! One set of numbers could use unsigned 16.16f, another set could use signed 30.1f, and so on. It really depends on whatever you need for the numbers that you're working with.

When shifting right, be careful not to shift onto the variables themselves. For example, it would be a mistake here to do something like:

```c
player_x = player_x >> player_fp; // DON'T DO THIS
```

Because you'd be destroying the fractional component, which needs to persist on to the next frame. Instead, you'd either want to shift while using `player_x` as an argument, or you'd want to initialize a separate variable and then shift when assigning to that. You typically only want the right-shifted version at the very end, for outputs.

## Addition and Subtraction

Before adding or subtracting fixed-point numbers, you need to make the denominators match. You can’t just add 1/2 and 3/4 together without first turning 1/2 into 2/4. So, let’s say we have these two variables:

```c
// variable 'a' uses an unsigned 27.5f fixed-point format
const int a_fp = 5;
unsigned int a = 3 << a_fp;

// variable 'b' uses an unsigned 16.16f fixed-point format
const int b_fp = 16;
unsigned int b = 4 << b_fp;
```

These equal 3 and 4, but they’re using different fixed-point representations. If we want to add them together, we need to shift one of them around to have the same format as the other. That looks something like this:

```c
// variable 'c' uses the fixed-point format from variable 'b'
unsigned int c = (a << (b_fp - a_fp)) + b;
```

First, we shift the variable `a` to match the fixed-point of variable `b`, based on the difference between the two fixed-points. Then we add. We could have shifted variable `b` to match the fixed-point of variable `a`, or we could have shifted both to an entirely new fixed-point. It’s open-ended to whatever precision is needed.

Note that we use multiple parentheses here; bit shifts do not follow the PEMDAS order of operations, so you will need an abundance of parentheses in order to tell the program exactly what order to follow. At least in C, the compiler will throw a warning if you don’t do this. Also note that you cannot shift by a negative number, it will just throw an error.

## Multiplication

What if you want to multiply `a` and `b` from before? If you multiply two fixed-point numbers together, you will multiply the fixed-point along with it. In other words, the denominator gets multiplied! This is fine, it just means that you need to shift right after the multiplication. That looks something like this:

```c
// variable 'c' uses the fixed-point format from variable 'b'
unsigned int c = (a * b) >> a_fp;
```

With variable `a` having a fixed-point of 27.5f and variable `b` having a fixed-point of 16.16f, that gives us a fixed-point of 11.21f after multiplication (5 plus 16 in the denominator). We shift right by 5 bits to get back to 16.16f, but we could have shifted right by 16 bits to get to 27.5f if we wanted that instead. Again, it’s open to whatever precision is needed.

It’s important to note that you don’t have infinite bits to work with. With an `int` value, you only have 32 bits lying around, and one of those bits might be needed for signing. Therefore, if you’re going to be multiplying fixed-point values, you need to be mindful of your fixed-point systems, otherwise it will quickly "overflow". Overflow is when you run out of bits, so the number clips to the left, outside of what can be contained.

For example, if you multiply a 16.16f number by another 16.16f number, then that leaves you with 0.32f during the process of multiplication. That’s not even one bit for the integer segment! Be careful and plan out your fixed-points accordingly. There are workarounds for this, but they will either be slower or less precise. One option is to multiply into a larger data type that has 64 bits of space (slower, for the GBA at least). In C, you would want a `uint64_t` for that. Another option is to shift each value right by half of the fixed-point before multiplying (less precise).

## Division

What about division? Well, you probably shouldn’t do that. That’s because if your system doesn’t have an FPU, it probably doesn’t have hardware-level division either. The GBA doesn’t have hardware-level division.

As mentioned before, you can shift right, and this will divide by powers of 2, rounding down. Note that even when shifting negative numbers right, it will still round *down*, not towards 0. That means that -3 shifted right by 1 bit will become -2, not -1.

Even though you can't do hardware-level division, there are usually creative workarounds. Think outside of the box for this one. How might you get the answer you want without properly dividing? You'd be surprised with just how much division you can get rid of.

If you really must divide, you would multiply the numerator by the fixed-point first, *before* dividing.

## Converting between fixed and floating point

Now you have a way to do mathematical operations efficiently. How do you set the initial values in a convenient way? How do you print the values in a way that is easier to understand than very big integer values?

Well, you can convert between fixed and floating point easily:

```c
const int player_fp = 3;

static inline int player_float2fixed(float value)
{
	return (int)(value * (1 << player_fp));
}

static inline float player_fixed2float(int value)
{
	return value / (float)(1 << player_fp);
}

// Macro version of the functions, for situations where you can't use functions
#define PLAYER_FLOAT2FIXED(value)     (int)((value) * (1 << (player_fp)))
#define PLAYER_FIXED2FLOAT(value)     ((value) / (float)(1 << (player_fp)))

int setup(void)
{
	int player_x = player_float2fixed(1.23);
	int player_y = PLAYER_FLOAT2FIXED(2.35);

	printf("Player X: %f\n", player_fixed2float(player_x);
	printf("Player Y: %f\n", PLAYER_FIXED2FLOAT(player_y);
}
```

Remember that those are floating point operations, so they will be slow. There is an exception: if you use `constexpr` or if the compiler detects that an expression is constant, it will calculate it at compile time automatically. This is very useful for setting initial fixed point values from floating point values.

```c
int player_x, player_y;

constexpr int player_start_x = player_float2fixed(1.23); // Only in C++
const int player_start_y = PLAYER_FLOAT2FIXED(2.35);

int setup(void)
{
	player_x = player_start_x;
	player_y = player_start_y;
}
```

And there you go! You now know everything needed to do fixed-point math. Good luck!

## FAQ
### What if I want to round to the nearest integer, or round up?

To round to the nearest integer, add 0.5 (half of the denominator), then shift right. To round up, add "the denominator minus one", then shift right.

### Why are my numbers slightly off?

It’s probably because of rounding errors. Not only your final values, but the in-between values as well. This entire process can involve rounding upon rounding, and this can accumulate over time to produce weird results.

### What about arithmetic between signed and unsigned variables?

Unsigned values will equal their signed counterparts all the way up until the leftmost bit is set. The math will still be as expected, as long as the leftmost bit of *the unsigned value* is 0. Note that the variable holding the result should probably be signed. If the unsigned variable is so large that the leftmost bit is set, then your result might overflow.

### Shouldn't the leftmost sign bit move around with the rest of the bits, when shifting?

Most languages, besides assembly, will handle the sign bit based on whether or not the variable is initialized as signed or unsigned. In ARM assembly, there are separate shifts depending on if you want to preserve the sign bit or move it with everything else.

### What about endianness?

Endianness is surprisingly not as relevant here as you'd think, at least if you're using a major programming language. I'm not going to describe endianness here.

### Is it "fixed-point" or "fixed point"?

Going to the Wikipedia page for [fixed-point arithmetic](#https://en.wikipedia.org/wiki/Fixed-point_arithmetic) and just doing a ctrl-f search, I can see 79 instances of "fixed-point" and 28 instances of "fixed point". So, it doesn't matter, just pick whichever looks prettier to you.

