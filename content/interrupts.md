# Hardware Interrupts

Figuring out hardware interrupts was kind of painful. Everything below is what I have gleaned from reading [ARM's docs](http://www.arm.com), the list, the advice of other emulator and demo authors, and from various other emulator's debug info. I hope it is of some use to you. Let me know if you find any errors or typos.

**Key points:**

All hardware interrupt vectors lie in the BIOS. You cannot handle interrupts directly, you must go through the BIOS. Thus, the instructions for exception handling in the ARM docs do not apply directly since we cannot handle the exceptions directly.

Interrupts are enabled by setting the flags in the [REG_IE](registers.md#REG_IE) and hardware registers like [REG_DISPSTAT](registers.md#REG_DISPSTAT), [REG_KEYCNT](registers.md#REG_KEYCNT), and [REG_DMAXCNT](registers.md#REG_DMA0CNT). The flag must be set in both REG_IE and the corresponding hardware register for it to work. When the interrupt signal is sent, the appropriate flag is set in [REG_IF](registers.md#REG_IF). The program code unsets this flag (by writing a 1 to that bit) in order to keep track of what interrupts have been handled.

**When an interrupt occurs, the CPU does the following:**

1. Switches state to IRQ mode, bank-swaps the current stack register and link register (thus preserving their old values), saves the CPSR in `SPSR_irq`, and sets bit 7 (interrupt disable) in the CPSR.
2. Saves the address of the next instruction in `LR_irq` compensating for Thumb/ARM depending on the mode you are in.
3. Switches to [ARM state](cpu.md#cpu-state), executes code in BIOS at a hardware interrupt vector (which you, the programmer, never see)

**The BIOS code picks up at the hardware interrupt vector and does the following:**

4. Pushes registers `0 - 3`, `12`, `LR_irq` (which cointains the address following the instruction when the interrupt occrued) onto the stack
5. Places the address for the next instruction (in the BIOS, not in your code) in `LR`
6. Loads the address found at `0x03007FFC`
7. Branches to that address.

**The program code at that address is executed.**

8. It is the responsiblity of the code at that address to return once finished, using `BX LR_irq`

**The BIOS finishes up where your code leaves off:**

9. It restores registers `0 - 3`, `12`, `LR_irq`
10. Branches to the intruction found in `LR`, using a `SUBS PC, LR_irq, #4`

**Upon receiving the SUBS PC, LR_irq, #4 instruction, the CPU**

11. copies the `SPSR_irq` back into the CPSR, restoring the status bits to their state when the interrupt occurred, and bank swaps back in the stack register ad link register. The CPU will thus be placed in the correct state ([ARM](cpu.md#cpu-state) or [Thumb](cpu.md#cpu-state)) it was in when the exception occurred.

<br>

So, the basic model for setting up interrupts is:

1. Place the address for your interrupt code at `0x03007FFC`.

2. Turn on the interrupts you wish to use:

    * [REG_DISPSTAT](registers.md#REG_STAT), [REG_TMXCNT](registers.md#REG_TM0CNT), [REG_KEYCNT](registers.md#REG_KEYCNT), or [REG_DMAXCNT](registers.md#REG_DMA0CNT) tell the hardware which interrupts to send
    * `0x04000200` ([REG_IE](registers.md#REG_IE)) masks which interrupts will actually be serviced (?)
    * `0x04000208` ([REG_IME](registers.md#REG_IME)) Turns all interrupts on or off.

3. When the interrupt is reached, the code at the address at `0x3007FFC` gets loaded into the CPU. To prevent unwanted errors/behavior, the first thing this code should do is disable interrupts.

4. To determine what interrupt this is, check the flags in `0x04000202` ([REG_IF](registers.md#REG_IF)). Unset the flag by writing a 1 to that bit.

5. Once finished with the service routine, reenable interrupts and execute a `BX LR` (*not* a `SUBS PC, LR #4`, which is what the BIOS does). The BIOS will then take over and return your program to where execution left off.

## Types of Hardware Interrupts

Enable these interrupts using [REG_DISPSTAT](registers.md#REG_STAT), [REG_TMXCNT](registers.md#REG_TM0CNT), [REG_KEYCNT](registers.md#REG_KEYCNT), or [REG_DMAXCNT](registers.md#REG_DMA0CNT), then setting the correct flags in [REG_IE](registers.md#REG_IE) and [REG_IME](registers.md#REG_IME).

* **V-Blank**: Occurs when the [vcount](registers.md#REG_VCOUNT) reaches 160, or 0xA0. (Enable in [REG_DISPSTAT](registers.md#REG_STAT))

* **H-Blank**: Occurs at the end of every raster line, from 0 - 228. H-blank interrupts DO occur during v-blank (unlike hdma, which does not), so write your code accordingly. Thanks to gbcft for verifying this. (Enable in [REG_DISPSTAT](registers.md#REG_STAT))

* **Serial**: I am unsure about this; I presume it has to do with the link cable.

* **V-Count**: Occurs when the [vcount](registers.md#REG_VCOUNT) reaches the number specified in [REG_DISPSTAT](registers.md#REG_STAT).

* **Timer**: These occur whenever one of the [timer registers](registers.md#timer-registers) is set to cause an interrupt whenever it overflows. Enable in [REG_TMXCNT](registers.md#REG_TM0CNT).

* **DMA**: These occur after a DMA transfer, according to the flags in the [DMA_CNT](registers.md#REG_DMA0CNT) registers and in [REG_IE](registers.md#REG_IE). Enable in [REG_DMAXCNT](registers.md#REG_DMA0CNT).

* **Key**: Occurs when the user presses or releases the buttons specified in [REG_KEYCNT](registers.md#REG_KEYCNT).

* **Cartridge**: Occurs when the user yanks out or inserts the cartridge out while the GBA is still running. For a cartridge interrupt to work properly the ISR must reside in RAM. It is possible to switch cartridges and have the routine resume execution on a completely different ROM.
