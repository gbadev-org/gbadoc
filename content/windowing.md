
# Windowing

Windowing is a method of dividing the screen into subsections known as (surprise) windows. The windows serve as boundary areas to determine where various layers of the GBA will be shown and where they will be clipped. There are two primary windows, win0 and win1, which can be enabled in [REG_DISPCNT](registers.md#REG_DISPCNT). There is also the "obj" window, which can be thought of as another window which is defined by the visible regions of the objs on screen. Finally there is the "outside" or "out" window - the area of the screen not already occupied by any other winodw.

The position and size of WIN0 and WIN1 are determined by [REG_WIN0H](registers.md#REG_WIN0H), [REG_WIN1H](registers.md#REG_WIN1H), [REG_WIN0V](registers.md#REG_WIN0V), and [REG_WIN1V](registers.md#REG_WIN1V) (I/O offsets 0x40, 0x42, 0x44, 0x46).

Exactly which characters and backgrounds appear within or without win0, win1, and the obj window is determined by [REG_WININ](registers.md#REG_WIN_IN) and [REG_WINOUT](registers.md#REG_WIN_OUT) (0x48 and 0x4A).

Here are some things to keep in mind when using windows:

* WIN0 and WIN1 are drawn from the left and top boundary up to but not including the right and bottom boundaries.

* Everything in WIN0 appears "above" WIN1 (i.e. it has higher priority), and everything in windows 0 & 1 appears above the WINOUT and obj windows.

* If a bg or the obj's are turned off in dispcnt, they're off in all windows regardless of the settings in win_in and win_out.

* If only one window is on, WINOUT affects everything outside of it. If both windows are on, WINOUT affects everything outside both of them. i.e. it affects _(!WIN0) && (!WIN1)_.

* If a window is on, but the effective display bits are all clear, the backdrop is displayed.

* If the window left coordinate is greater than the window right coordinate, the window will be drawn outside of this region (i.e. to the left and to the right) rather than in the area inbetween.

* Likewise, if the window top coordinate is greater than the window bottom coordinate, the window will be drawn to the top and the bottom.

* A completely inverted window is drawn in the area outside of the "+" shaped region defined by its boundaries.

Windows can be used in console games for a variety of different effects. Though the window registers define a square region, differently shaped windows can be achieved by using [HDMA](registers.md#REG_DMA0CNT) or [hblank interrupts](interrupts.md) to change the parameters each scanline. Lantern lighting (when the hero has a lantern or flashlight that illuminates a certain region of a cave) and x-ray vision (use of the window to cut away layers that are in front) are two common effects created with windows. More are certainly possible.

Thanks again to gbcft for most of these notes and for his extensive testing on the nature of windowing.
