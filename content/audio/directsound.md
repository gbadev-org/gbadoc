# Direct Sound

Direct Sound (not to confuse with DirectSound which is a registered trademark of Microsoft) refers to the two 8-bit digitial-to-analog converters part of the Gameboy Advance sound system (GBAS). The samples to be played, which must be 8-bit signed, are loaded in consecutive adresses starting at 0x40000A0 (REG_FIFO_A). These adresses acts as a FIFO (First-In-First-Out), meaning that lower adresses bytes are played first. Playback frequency is controlled by the overflow of either Timer 0 or Timer 1, allowing the two Direct sound channels to play at different frequencies independently. Direct sound can work in two modes: DMA mode and Interrupt mode. DMA mode is the most efficient way of playing Direct sound. Because once empty, sound FIFOs are automatically reloaded with the next samples by the DMA controller, without any program intervention. The other mode uses an interrupt handler that manually load the FIFOs. This is less efficient than DMA mode but in some cases, it is the only solution.

## Direct Sound Output Control Register

| Offset | Name           |
| ------ | -------------- |
| 0x082  | REG_SOUNDCNT_H |

| Bit(s) | Effect                                                | Access |
| ------ | ----------------------------------------------------- | ------ |
| 1-0    | Output sound ratio for chan. 1-4 (0=25%,1=50%,2=100%) | RW     |
| 2      | Direct sound A output ratio (0=50%, 1=100%)           | RW     |
| 3      | Direct sound B output ratio (0=50%, 1=100%)           | RW     |
| 7-4    | Unused                                                |        |
| 8      | Direct sound A to right output                        | RW     |
| 9      | Direct sound A to left output                         | RW     |
| A      | Direct sound A Sampling rate timer (timer 0 or 1)     | RW     |
| B      | Direct sound A FIFO reset                             | RW     |
| C      | Direct sound B to right output                        | RW     |
| D      | Direct sound B to left output                         | RW     |
| E      | Direct sound B Sampling rate timer (timer 0 or 1)     | RW     |
| F      | Direct sound B FIFO reset                             | RW     |

Output ratios control the output volume. Set these bits when Sound 1-4 or Direct Sound plays too loud relative to each other. Direct Sound channels can be send to Left, Rigth or both outputs. Bit A and E selects which timer to use as the sampling frequncy reference. Both Direct sound channels can use the same timer, and it is usually the case for software mixing. FIFO reset prepares the Direct sound harware for playback and put the playing cursor back to FIFO's sample 0. It should always be performed before playback start.

The following examples demonstrate Direct Sound playback in DMA mode and Interrupt mode.

## DMA Mode Direct Sound Example

To use DirectSound in DMA mode:

- Set DS outputs and volumes
- Set timer0 (or 1) count value to 0xffff-round(cpuFreq/playbackFreq)
    - ie: For 16khz, timer count=65536-round(2^24/16000)=0xFBE8
- Set DMA channel's source to the sample's address and destination adress to either FIFOA or FIFOB adresses
- Reset the FIFO before starting sound by setting the FIFO reset bit.
- Set DMA start mode to 11 to instruct DMA to repeat on FIFO-empty requests. Many documents list this state as invalid, which is naturally not the case.
    - ie:REG_DMA1CNT_H=0xb600=DMA enabled+ start on FIFO+32bit+repeat
- Set DMA repeat and 32bit moves and set source and destination modes to increment.
- Enable timer0 at Cpu frequency (clock divider=0)

Sound should start immediately and will play past the sample if not stopped. You can use timer1 to count played samples and stop the sound. To do this, set timer 1 to cascade and enable irq for timer 1 and set its count to 0xffff-samples count. Your irq handler should stop the sound by disabling timer 0 and the dma channel(s).

```C
#include "gba.h"
extern const u32 _binary_lo1234_pcm_start[]; //the sample. its a pcm wave file converted to an elf file with objcopyroda.exe (devrs.com/gba)

void InterruptProcess(void) __attribute__ ((section(".iwram"))); //the interrupt handler from crt0.s

void InterruptProcess(void){
//sample finished!,stop Direct sound
REG_TM0CNT_H=0; //disable timer 0
REG_DMA1CNT_H=0; //stop DMA

//clear the interrupt(s)
REG_IF |= REG_IF;
}


void AgbMain (void){
//play a mono sound at 16khz
//uses timer 0 as sampling rate source
//uses timer 1 to count the samples played in order to stop the sound
REG_SOUNDCNT_H=0x0b0F; //enable DS A&B + fifo reset + use timer0 + max volume to L and R
REG_SOUNDCNT_X=0x0080; //turn sound chip on

REG_DMA1SAD=(unsigned long)_binary_lo1234_pcm_start; //dma1 source
REG_DMA1DAD=0x040000a0; //write to FIFO A address
REG_DMA1CNT_H=0xb600; //dma control: DMA enabled+ start on FIFO+32bit+repeat+increment source&dest

REG_TM1CNT_L=0x7098; //0xffff-the number of samples to play
REG_TM1CNT_H=0xC4; //enable timer1 + irq and cascade from timer 0

REG_IE=0x10; //enable irq for timer 1
REG_IME=1; //master enable interrupts

//Formula for playback frequency is: 0xFFFF-round(cpuFreq/playbackFreq)
REG_TM0CNT_L=0xFBE8; //16khz playback freq
REG_TM0CNT_H=0x0080; //enable timer0

}
```

True stereo output is a simple extension of the above code:

- Set REG_SOUNDCNT_H to send DS A to right output and DS B to left output
- Set DMA1 source to the right buffer, and destination to DS A FIFO
- Set DMA2 source to the left buffer, and destination to DS B FIFO
- Set timer 0 as sampling rate source for both DS A&B

## Interrupt Mode Direct Sound Example

DMA mode Direct Sound has reportedly being causing problems in multi-players games. This is because during DMA tranfers, if interrupts occurs, they are only processed upon completion of that DMA. That means possible transmission losses due to bytes in the serial buffer being overwitten before beign read. On possible solution to this problem would be the use of Interrupt mode Direct sound playback. In this mode you set a timer (again 0 or 1), to the sampling frequency, set it to generate interrupts and load the FIFO(s) in the interrupt handler. Note that this methodology might impose problems if interrupts are blocking (ie. not allowing multiple interrupts at once), however if several interrupts at once are allowed inside the handler, this should resolve the issue.

To use Direct sound in Interrupt mode:

- Set DS ouputs and volume
- Set timer 0 frequency to 0xffff
- Enable timer 0, set it to generate IRQs and set the clock divider to 1024 (gives 16384 hz )
- In the interrupt handler:
    - Load FIFO(s) each 4 samples with 4 bytes
    - Increment the sample counter
    - Stop timer 0 when sample end has be reached

```C
#include "gba.h"
extern const u32 _binary_lo1234_pcm_start[]; //the sample. its an pcm wave file converted to an elf file with objcopyroda.exe (devrs.com/gba)
void InterruptProcess(void) __attribute__ ((section(".iwram")));//the interrupt handler from crt0.s

int iNextSample=0;
int SampleSize=36712;

void InterruptProcess(void){
//load FIFO each 4 samples with 4 bytes
if(!(iNextSample&3))REG_SGFIFOA=_binary_lo1234_pcm_start[iNextSample>>2];

iNextSample++;

if(iNextSample>SampleSize){
    //sample finished!
    REG_TM0CNT_H=0; //disable timer 0
}
//clear the interrupt(s)
REG_IF |= REG_IF;
}
void AgbMain(void){
//play a sample at 16Khz using interrupt mode
REG_SOUNDCNT_H=0x0B0F; //DirectSound A + fifo reset + max volume to L and R
REG_SOUNDCNT_X=0x0080; //turn sound chip on

REG_IE=0x8; //enable timer 0 irq
REG_IME=1; //enable interrupts

/*set playback frequency. note: using anything else thank clock multipliers to serve as sample frequencies tends to generate distortion in the output. It has probably to do with timing and FIFO reloading. More testing need to be done. */

REG_TM0CNT_L=0xffff;
REG_TM0CNT_H=0x00C3; //enable timer at CPU freq/1024 +irq =16384Khz sample rate

}
```