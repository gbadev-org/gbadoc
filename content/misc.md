# Miscellaneous/Weirdness

This is a new section devoted any interesting little tidbits that don't quite fit in anywhere else. I'm starting it off with . . .

## Unknown Registers

These are registers that I don't know the function of. While most aren't even readable, certain ones seem to be writeable. I have an idea of what some of them are based on the headers included with many open source demos, but as to their specific function, I have no idea. Let me know if you find out what purpose they serve, if any, and I will put your notes here (and of course give credit).

<pre>
0x002:         REG_DISPCNT_H - Writing to bit 0 will cause (horizontally)
               adjacent pairs of pixels to have their green component
               swapped. What good is this for?  Anybody know?

0x04E:         REG_MOSAIC_H - Unreadable (gobbledygook)
0x056 - 0x05E:	Unreadable (gobbledygook)
0x066:         REG_SOUND1CNT_X (high 16 bits) Unreadable (0x0000)
0x06A:         REG_SOUND2CNT_L (high 16 bits) Unreadable (0x0000)
0x06E:         REG_SOUND2CNT_H (high 16 bits) Unreadable (0x0000)
0x076:         REG_SOUND3CNT_X (high 16 bits) Unreadable (0x0000)
0x07A:         REG_SOUND4CNT_L (high 16 bits) Unreadable (0x0000)
0x07E:         REG_SOUND4CNT_L (high 16 bits) Unreadable (0x0000)
0x086:         REG_SOUNDCNT_X (high 16 bits) Unreadable (0x0000)
0x08A:         REG_SOUNDBIAS (high 16 bits) Unreadable (0x0000)
0x08C:         Unreadable (gobbledygook)
0x08E:         Unreadable (gobbledygook)
0x0A8 - 0xAE:  Unreadable (gobbledygook)
0x0E0 - 0x0FE: Unreadable (gobbledygook)
0x110 - 0x11E: Unreadable (gobbledygook)
0x12C:         Unreadable (gobbledygook)
0x12E:         Unreadable (gobbledygook)
0x136:         REG_R (high 16 bits) Unreadable (0x0000)
0x138 - 13E:   Unreadable (gobbledygook)

0x140:	       REG_HS_CTRL - Seems to have the following properties:
               R R R R  R R R R  R   R R  R R R R
               F E D C  B A 9 8  7 6 5 4  3 2 1 0

0x142:         Unreadable (0x0000)
0x144-14E:     Unreadable (gobbledygook)
0x150:         REG_JOYRE_L - Unreadable (0x0000)
0x152:         REG_JOYRE_H - Unreadable (0x0000)
0x154:         REG_JOYTR_L - Unreadable (0x0000)
0x156:         REG_JOYTR_H - Unreadable (0x0000)
0x158:         JOYSTAT_L - defaults to 0x8.  
               Seems to have the following properties: 
               R R R R  R R R R  R R        R R R
               F E D C  B A 9 8  7 6 5 4  3 2 1 0

0x15A:         JOYSTAT_H - Unreadable (0x0000)
0x15C - 0x1FE: Unreadable (gobbledygook)
0x206:         REG_WSCNT (high 16 bits) Unreadable (0x0000)
0x20A:         REG_IME (high 16 bits) Unreadable (0x0000)
0x20C - 0x2FE: Unreadable (gobbledygook)
0x302:         REG_PAUSE (high 16 bits) Unreadable (0x0000)
0x304 - 0x3FE: Unreadable (gobbledygook)
0x800:         Seems to have the following properties: 
			
               F E D C  B A 9 8  7 6 5 4  3 2 1 0
               X X X X  X X X X  X X M X  L K J I
				
               0 (I) = When set, this sets the top-left tile number to 0x82
               1 (J) = Unknown.
               2 (K) = Unknown.
               3 (L) = Unkown.
               5 (M) = When unset this disallows VRAM changes (but can be used
                       simulteneously with bit 0).  It is set by default.

               What little we know about this register comes from gbcft's 
               experimentation a ways back, and he's not entirely sure about
               even this.  Anybody who knows about it can feel free to [email
](mailto:SorcererXIII@yahoo.com)               me with more info. This register (the whole 32 bit word) is also mirrored at
               intervals of 0x10000 bytes in IORAM (it is the only IORAM
               register that is mirrored in in this way).  

0x802:         Read only (reads as 0x0d00).
</pre>

I have noted that some of these registers always read as a certain repeating gobbledygook value no matter what is written to them (I take this to be of the same origin as the gobbledygook that comes from reading BIOS -- see [Jeff Frohwein's](http://www.devrs.com/gba) GBA FAQ), but some always read 0. For the most part these seem to be the "high" 16 bits of registers we already know the function of (thanks gbcft for pointing out what probably should have been obvious to me). Others are registers that probably do something, but I just don't know what. They may read as something other than 0 if the conditions are right.  
  
### Possibilities:

The following are some suggested possiblities for what the unkown registers could be (thanks goes out to Kay for this), based on what Nintendo has included in previous hardware:  
  
SPR_TIME_OVER bit: sprite blit time out register (1 bit). This bit is set when sprite processing overloads during HDraw  
SPR_RANGE_OVER bit: displayed objects number (regardless of the size) becomes or is greater than maximum GFX ASIC is able to process  
xxxx_VER_NUMBER reg: regsiter containing the xxxx IC version number (usually bit 0 to 3 if made by Nintendo)  
  
Like all Nintendo hardware designs, the GBA may have one or more 8/16 bit in/out parallel data ports mapped at the bottom of I/O addresses.  
