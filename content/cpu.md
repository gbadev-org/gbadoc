# CPU

<style>
tt {
  white-space: pre;
}
</style>

This section is intended to be an overview only, detailing those aspects of the CPU which are important to understand when developing for the GBA in particular. A more thorough description of the ARM7tdmi CPU can be found in the [technical reference manuals](http://www.arm.com/arm/TRMs?OpenDocument) on [ARM's website](http://www.arm.com).

The CPU is a 16.78 MHz ARM7tdmi RISC processor. It is a 32-bit processor but can be switched to "Thumb" state, which allows it to handle a special subset of 16-bit instructions that map to 32-bit counterparts. Instructions follow a three-stage pipeline: fetch, decode, execute. As a result, the [program counter](#r15 (PC)) always points two instructions ahead of the one currently being executed.

## CPU Registers

16 registers are visible to the user at any given time, though there are 20 [banked registers](#banked-registers) which get swapped in whenever the CPU changes to various priveleged modes. The registers visible in user mode are as follows:

* **r0-r12:** General purpose registers, for use in every day operations

* **r13 (SP):** Stack pointer Register. Used primarily for maintaining the address of the stack. This default value (initialized by the BIOS) differs depending on the current [processor mode](#processor-modes), as follows:

  <pre>
  User/System:  0x03007F00
  IRQ:          0x03007FA0
  Supervisor:   0x03007FE0
  </pre>

  As far as I know the other modes do not have default stack pointers.

* **r14 (LR):** Link Register. Used primarily to store the address following a "bl" (branch and link) instruction (as used in function calls)

* <a id="r15"></a> **r15 (PC):** The Program Counter. Because the ARM7tdmi uses a 3-stage pipeline, this register always contains an address which is 2 instructions ahead of the one currrently being executed. In 32-bit ARM state, it is 8 bytes ahead, while in 16-bit Thumb state it is 4 bytes ahead.

* **CPSR:** The Current Program Status Register. This contains the status bits relevant to the CPU:

  <div style="font-size: 80%">
  <PRE style="width: min-content; margin: 16px auto">31 30 29 28  27 26 25 24  23 22 21 20  19 18 17 16  15 14 13 12  11 10 9 8  7 6 5 4  3 2 1 0
  <FONT COLOR="#008800"> N </FONT> <FONT COLOR="#0099FF">Z </FONT> <FONT COLOR="#9900CC">C</FONT> <FONT COLOR="#FF0099"> V</FONT> <FONT
    COLOR="#FF3300">  R  R  R  R   R  R  R  R   R  R  R  R   R  R  R  R   R  R R R </FONT><FONT COLOR="#008800"> I </FONT><FONT
    COLOR="#0099FF">F</FONT> <FONT COLOR="#9900CC">T</FONT> <FONT COLOR="#FF0099">M  M M M M</FONT></PRE>
  </div>

  | Bits    | Description                                             |
  |---------|---------------------------------------------------------|
  | <tt> 0-4 <FONT COLOR="#FF0099">(M)</FONT></tt> | <p>Mode bits. These indicate the current processor mode:</p><p>`10000` - User mode<br>`10001` - FIQ mode<br>`10010` - IRQ mode<br>`10011` - Supervisor mode<br>`10111` - Abort mode<br>`11011` - Undefined mode<br>`11111` - System mode<br></p>
  | <tt>   5 <FONT COLOR="#9900CC">(T)</FONT></tt> | [Thumb state](#cpu-state) indicator. If set, the CPU is in Thumb state.  Otherwise it operates in normal ARM state. Software should never attempt to modify this bit itself.
  | <tt>   6 <FONT COLOR="#0099FF">(F)</FONT></tt> | FIQ interrupt disable. Set this to disable FIQ interrupts.
  | <tt>   7 <FONT COLOR="#008800">(I)</FONT></tt> | [IRQ interrupt](interrupts.md) disable. Set this to disable IRQ interrupts. On the GBA this is set by default whenever IRQ mode is entered. Why or how this is the case, I do not know.
  | <tt>8-27 <FONT COLOR="#FF3300">(R)</FONT></tt> | Reserved
  | <tt>  28 <FONT COLOR="#FF0099">(V)</FONT></tt> | Overflow condition code
  | <tt>  29 <FONT COLOR="#9900CC">(C)</FONT></tt> | Carry/Borrow/Extend condition code
  | <tt>  30 <FONT COLOR="#0099FF">(Z)</FONT></tt> | Zero/Equal condition code
  | <tt>  31 <FONT COLOR="#008800">(N)</FONT></tt> | Negative/Less than condition code


## Processor Modes

The ARM7tdmi has six modes: user, system, IRQ, FIQ, SVC, Undef, and Abt. The default is user mode. Certain events will trigger a mode switch. Some modes cause an alternate set of registers to be swapped in, effectively replacing the current set of registers until the mode is exited.

* **<span id="User">User</span>:** This is the default mode.

* **<span id="System">System</span>:** This is intended to be a priveleged user mode for the operating system. As far as I can tell it is otherwise the same as User mode. I am not sure if the GBA ever enters System mode during [BIOS](bios.md)) calls.

* **<span id="IRQ">IRQ</span>:** This mode is entered when an Interrupt Request is triggered. Any interrupt handler on the GBA will be called in IRQ mode.

    * <a id="banked-registers"></a> Banked registers: The ARM7tdmi has several sets of banked registers that get swapped in place of normal user mode registers when a priveleged mode is entered, to be swapped back out again once the mode is exited. In IRQ mode, r13\_irq and r14\_irq will be swapped in to replace r13 and r14. The current [CPSR](#CPSR) contents gets saved in the SPSR\_irq register.

* **<span id="FIQ">FIQ</span>:** This mode is entered when a Fast Interrupt Request is triggered. Since all of the hardware interrupts on the GBA generate IRQs, this mode goes unused by default, though it would be possible to switch to this mode manually using the "msr" instruction.

    * Banked registers: r8\_fiq, r9\_fiq, r10\_fiq, r11\_fiq, r12\_fiq, r13\_fiq, r14\_fiq, and SPSR\_fiq.

* **<span id="SVC">SVC</span>:** Supervisor mode. Entered when a SWI (software interrupt) call is executed. The GBA enters this state when calling the [BIOS](bios.md) via SWI instructions.

    * Banked registers: r13\_svc, r14\_svc, SPSR\_svc.

* **<span id="ABT">ABT</span>:** Abort mode. Entered after data or instruction prefetch abort.

    * Banked registers: r13\_abt, r14\_abt, SPSR\_abt.

* **<span id="UND">UND</span>:** Undefined mode. Entered when an undefined instruction is executed.

    * Banked registers: r13\_und, r14\_und, SPSR\_und.

### CPU State

The ARM7tdmi has two possible states, either of which may be entered without fear of losing register contents or current processor mode.

**To enter Thumb State**: In this state the CPU executes 16-bit, halfword-aligned instructions. There are two ways it can be entered:

* A BX rn, where rn contains the address of the thumb instructions to be executed, +1. Bit 0 must be 1 or the switch won't be made and the CPU will try to interperet the binary Thumb code as 32-bit ARM instructions.
* Returning from an [interrupt](interrupts.md) that was entered while in Thumb mode.
* Executing any arithmetic instruction with the PC as the target and the 'S' bit of the instruction set, with bit 0 of the new PC being 1.

**To Enter ARM State:** This is the default state. It executes 32-bit, word-aligned instructions. When in Thumb state, the CPU can be switched back to ARM state by:

* A BX rn, where rn contains the address of the ARM instructions to be executed. Bit 0 must be 0.
* Entering an [interrupt](interrupts.md).

**For more complete information on the ARM7tdmi, be sure to check out ARM's [technical reference manuals](http://www.arm.com/arm/TRMs?OpenDocument).**
