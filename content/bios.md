
# BIOS (Software Interrupts)

The BIOS calls are basically SWI instructions; the value passed into the instruction tells the CPU which interrupt to execute. There is very little public domain information on the BIOS. Marat Fayzullin has a listing of the BIOS calls on his VGBA website, and Forgotten has added a list to his [Visual Boy Advance FAQ](http://vboy.emuhq.com/faq.shtml). It is using these, in combination with observing the behavior of various demos in CowBite and other emulators that I was able to piece together what I have here.

### `0x00`: SoftReset

Resets the GBA and runs the code at address `0x02000000` or `0x08000000` depending on the contents of `0x03007ffa` (0 means `0x08000000` and anything else means `0x02000000`).

### `0x01`: RegisterRamReset

Performs a selective reset of memory and I/O registers.
<pre>
Input: r0 = reset flags
</pre>

### `0x02`: Halt

Halts CPU execution until an interrupt occurs.

### `0x03`: Stop

Stops the CPU and LCD until the enabled interrupt (keypad, cartridge or serial) occurs.

### `0x04`: IntrWait

Waits for the given interrupt to happen.

<pre>
Input: r0 = initial flag clear, r1 = interrupt to wait
</pre>

### `0x05`: VBlankIntrWait

Waits for vblank to occur. Waits based on interrupt rather than polling in order to save battery power.

Equivalent of calling IntrWait with r0=1 and r1=1.

### `0x06`: Div

<pre>
Input: r0 = numerator, r1 = denominator  
Output: r0 = numerator/denominator;
        r1 = numerator % denominator;  
        r3 = abs (numerator/denominator)
</pre>

### `0x07`: DivArm

<pre>
Input: r0 = denominator, r1 = numerator
Output: r0 = numerator/denominator;
        r1 = numerator % denominator;
        r3 = abs (numerator/denominator)
</pre>

### `0x08`: Sqrt

<pre>
Input: r0 = number
Output: r0 = sqrt(number)
</pre>

### `0x09`: ArcTan

<pre>
Input: r0 = angle (signed 16-bit)
Output: r0 = arctan(angle)
</pre>

### `0x0A`: ArcTan2

Calculates the arctangent of the given point.

<pre>
Input: r0 = X (signed 16-bit), r1 = Y (signed 16-bit)
Output: r0 = arctan
</pre>

### `0x0B`: CPUSet

Performs a memory transfer.

<pre>
Input: r0 = source address, r1 = dest address
r2 (guess) - formatted like DMA transfer
bit26 = 32 or 16 bit transfer
bits 15 - 0 = number of transfers
</pre>

### `0x0C`: CPUFastSet

<pre>
Also performs a memory transfer, in 32-bit blocks, presumably with some optimization (and limitations?). I believe the register parameters are set up the same as, or at least similar to, those for CPUSet.
</pre>

### `0x0D`: BiosChecksum

Calculates the checksum of the whole BIOS by adding every 32-bit word from the BIOS.

<pre>
Output: r0 = BIOS checksum
</pre>


### `0x0E`: BgAffineSet

Calculates the affine parameters for sprites (rotation and scaling).

<pre>
Input: r0 = source, r1 = dest, r2 = number of calculations, r3 = offset between calculations
</pre>

### `0x0F`: ObjAffineSet

### `0x10`: BitUnPack

Unpacks bit packed data.

<pre>
Input: r0 = source, r1 = dest, r2 = unpack parameters
</pre>

### `0x11`: LZ77UnCompWRAM

Uncompresses LZSS data 8 bits at a time

<pre>
Input: r0 = source address, r1 = dest address
</pre>

### `0x12`: LZ77UnCompVRAM

Uncompresses LZSS data 16 bits at a time

<pre>
Input: r0 = source address, r1 = dest address
</pre>

Note: The LZ77 decompressors actually decompress LZSS, not LZ77, which is slightly different. You will have to look on the web to find the algorithm as it is beyond the scope of this document. The following assumes a general famliarity with LZSS.

On the GBA, the ring buffer or "window" is of size 4096, the minumim compressed length is 3 and the maximum compressed length is 18. Looking into a compressed buffer you will find the size of the uncompressed memory in bytes 2, 3, and 4 (I'm not sure what the first byte does, but it seems to always be set to "01"), followed by the coded data. This is divided up into sections consisting of an 8 bit key followed by a corresponding eight items of varying size. The upper bits in the key correspond to the items with lower addresses and vice versa. For each bit set in the key, the corresponding item will be 16 bits; the top bits four being the number of bytes to output, minus 3, and the bottom sixteen bits being the offset behind the current window position from which to output. For each bit which is not set, the corresponding item is an uncompressed byte and gets sent to the output.

Thanks to Markus for providing me with some source that helped me figure out all of this.

### `0x13`: HuffUnComp

Unpacks data compressed with Huffman and writes it 32-bits at a time.

<pre>
Input: r0 = source address, r1 = dest address
</pre>

### `0x14`: RLUnCompWRAM

Uncompresses RLE data 8 bits at a time

<pre>
Input: r0 = source address, r1 = dest address
</pre>

### `0x15`: RLUnCompVRAM

Uncompresses RLE data 16 bits at a time

<pre>
Input: r0 = source address, r1 = dest address
</pre>

### `0x16`: Diff8bitUnFilterWRAM

Unpacks data filtered with 8-bit difference and writes it 8-bits at a time.

<pre>
Input: r0 = source, r1 = dest
</pre>

### `0x17`: Diff8bitUnFilterVRAM

Unpacks data filtered with 8-bit difference and writes it 16-bits at a time.

<pre>
Input: r0 = source, r1 = dest
</pre>

### `0x18`: Diff16bitUnFilter

Unpacks data filtered with 16-bit difference and writes it 16-bits at a time.

<pre>
Input: r0 = source, r1 = dest
</pre>

### `0x19`: SoundBiasChange

Sets the sound bias from 0 to 0x200 or from 0x200 to 0 depending on the value of R0.

<pre>
Input: r0 = 0 to set it to 0, other values to set it to 0x200
</pre>

### `0x1A`: SoundDriverInit

Initializes the built in sound driver.

<pre>
Input: r0 = SoundArea
</pre>

### `0x1B`: SoundDriverMode

Sets the operation of the built in sound driver.

<pre>
Input: r0 = operation mode
</pre>

### `0x1C`: SoundDriverMain

Main function of the built in sound driver that is called by applications every VBlank period to render the sound.

### `0x1D`: SoundDriverVSync
### `0x1E`: SoundChannelClear
### `0x1F`: MIDIKey2Freq
### `Ox20`: MusicPlayerOpen
### `0x21`: MusicPlayerStart
### `0x22`: MusicPlayerStop
### `0x23`: MusicPlayerContinue
### `0x24`: MusicPlayerFadeOut
### `0x25`: MultiBoot
### `0x26`: ??
### `0x27`: ??
### `0x28`: SoundDriverVSyncOff
### `0x29`: SoundDriverVSyncOn
### `?`: FIQMasterEnable