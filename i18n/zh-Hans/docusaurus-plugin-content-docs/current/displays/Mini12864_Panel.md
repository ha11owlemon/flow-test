---
id: Mini12864_Panel
title: Mini12864 面板
slug: /Mini12864_Panel
description: Mini12864 面板 的显示面板文档，便于查阅相关原始说明。
source_file: Mini12864_Panel.md
source_language: en
---

## 产品介绍


![Mini12864](/images/Mini12864.png)

这是一款开源、廉价、带 RGB 指示灯、兼容 Marlin 的显示屏，支持离线打印，分辨率为 12864，显示区域为 2.4 英寸，SD 卡座可侧置或垂直放置，方便不同安装场合，非常适合小型 3D 打印机。

共有三个版本：

V1.2 在编码器周围有两个 RGB LED，背光为固定颜色。

V2.0 在编码器周围有两个 RGB LED，背光为 RGB，由 3 个 PWM 引脚控制。

V2.1 在编码器周围有两个 RGB LED，背光为 RGB，由 3 个 WS2811 芯片控制，与 NEOPIXEL_LED 相同。

## 特点

- 2.4 英寸高对比度图形 LCD
- 黑灰/黑绿/白黑/白蓝/绿黑，5 种显示风格
- 通过 SPI 与主机微控制器通信
- 支持垂直或侧置 SD 插槽，带卡检测，可选配 SD 模块
- 带 RGB 光环的旋转编码器
- 可配置 RGB LED 灯
- 软件可配置对比度设置
- 可 3D 打印外壳和安装 STL 文件
- EXP1 和 EXP2 RAMPS 兼容插座



## 应用

3D 打印机、CNC 机床、其他微控制器项目



## 典型接线
![](/images/Mini12864-bottom.svg)

![](/images/Mini12864-EXP1.svg)

![](/images/Mini12864-EXP2.svg)

## 注意：

![](/images/Spider_notice.png)

    为了兼容某些主板，例如 RAMPS1.4，mini12864 配备了 RST (R3) 和 KILL (R4) 可选电阻。目前，某些主板（S6/Spider）将 KILL 改为 5V。此时，请确保 mini12864 上的 R4 处于空置状态，否则按下屏幕上的按钮会导致 5V 与 GND 之间短路，长期运行会导致主板损坏。

## 固件配置

此屏幕驱动为 ST7567，兼容 Marlin Mini 面板（UC1701，与 ST7567 相同）。已测试良好，需要进行以下配置。

**开始之前，请安装最新版本的 U8glib。**

### 步骤1. 更改引脚。

在兼容 RAMPS 的主板上，需要在 pins_RAMPS.h 中进行以下更改：
```
 #elif ENABLED(MINIPANEL)
      #define BEEPER_PIN 37
      // Pins for DOGM SPI LCD Support
      #define DOGLCD_A0  16
      #define DOGLCD_CS  17
      #define LCD_BACKLIGHT_PIN -1 // backlight LED on A11/D65
      #define LCD_RESET_PIN  23
      #define SDSS   53

      #define KILL_PIN -1
      #define LCD_CONTRAST 200
      #define BTN_EN1 31
      #define BTN_EN2 33
      #define BTN_ENC 35  //the click switch
    
      #define SD_DETECT_PIN 49
```

### 步骤2. 配置 configuration.h。

为了控制 RGB-LED，还需要在 Marlin 中开启 RGB 控制。

对于 V1.2 和 V2.0：

需要启用 RGB_LED，并配置 R/G/B 引脚。
```
// 1.enable this line for mini12864 V1.2 and 
#define RGB_LED 
//#define RGBW_LED

#if ENABLED(RGB_LED) || ENABLED(RGBW_LED)
//2.change the 3 line for mini12864 V1.2 and V2.0
  #define RGB_LED_R_PIN 25
  #define RGB_LED_G_PIN 27
  #define RGB_LED_B_PIN 29
  #define RGB_LED_W_PIN -1
#endif
```

对于 V2.1，只需启用 NEOPIXEL_LED。
```
// Support for Adafruit Neopixel LED driver
// 1. only need enable the NEOPINEL_LED for mini12864 V2.1
#define NEOPIXEL_LED
#if ENABLED(NEOPIXEL_LED)
  #define NEOPIXEL_TYPE   NEO_GRBW // NEO_GRBW / NEO_GRB - four/three channel driver type (defined in Adafruit_NeoPixel.h)
  #define NEOPIXEL_PIN    25        // LED driving pin on motherboard 4 => D4 (EXP2-5 on Printrboard) / 30 => PC7 (EXP3-13 on Rumba)
  #define NEOPIXEL_PIXELS 30       // Number of LEDs in the strip
  #define NEOPIXEL_IS_SEQUENTIAL   // Sequential display for temperature change - LED by LED. Disable to change all LEDs at once.
  #define NEOPIXEL_BRIGHTNESS 127  // Initial brightness (0-255)
  //#define NEOPIXEL_STARTUP_TEST  // Cycle through colors at startup
#endif
```

### 步骤3. 配置 configuration_adv.h。

如果需要手动更改 RGB 颜色，则需要在 configuration_adv.h 中启用 LED_CONTROL_MENU。如果不需要，可以跳过此步骤。
```
/**
 * LED Control Menu
 * Enable this feature to add LED Control to the LCD menu
 */
// 1. enable the LED_CONTROL_MENU RGB manual control
#define LED_CONTROL_MENU
#if ENABLED(LED_CONTROL_MENU)
  #define LED_COLOR_PRESETS                 // Enable the Preset Color menu option
  #if ENABLED(LED_COLOR_PRESETS)
    #define LED_USER_PRESET_RED        255  // User defined RED value
    #define LED_USER_PRESET_GREEN      128  // User defined GREEN value
    #define LED_USER_PRESET_BLUE         0  // User defined BLUE value
    #define LED_USER_PRESET_WHITE      255  // User defined WHITE value
    #define LED_USER_PRESET_BRIGHTNESS 255  // User defined intensity
    //#define LED_USER_PRESET_STARTUP       // Have the printer display the user preset color on startup
  #endif
#endif // LED_CONTROL_MENU
```

### 步骤4. 在 ultralcd_impl_DOGM.h 中添加代码。

需要在 ultralcd_impl_DOGM.h 中添加一小段代码，否则屏幕可能不显示文本，或者可能不清晰。
在 "static void lcd_implementation_init()" 函数中添加 "u8g.setContrast(255);"：

![1551170953232](/images/1551170953232.png)

## 可选硬件模块：

mini12864 的 SD 卡可以设置在侧面或前面，这需要一个模块来实现。如下所示：

![mini12864_SD1](/images/mini12864_SD1.png)

## 注意

-待定-

## 常见问题

1. 问：屏幕使用什么驱动？
   答：Sitronix ST7567，您可以在我们的 [github](https://github.com/FYSETC/Mini-12864-Panel) 中获取规格书。

2. 问：三个版本之间有什么区别？

   答：只有背光不同，wiki 开头有详细描述。

## 附件
### 1. 原理图

---------

您可以在 [github](https://github.com/FYSETC/Mini-12864-Panel) 上找到三个版本的原理图。



### 2. 尺寸

---------

![](/images/mini12864_dim.png)

**有关详细尺寸，请查看 [github](https://github.com/FYSETC/Mini-12864-Panel) 上的 dwg/step 文件。**

## 商店
---
- LCD（源材料中未提供链接）

## 技术支持
---
请将任何技术问题提交到我们的 [论坛](http://forum.fysetc.com/) 或 [facebook](https://www.facebook.com/groups/197476557529090/)。

---

内容和图片来源：[FYSETC Wiki — Mini12864 Panel](https://wiki.fysetc.com/Mini12864_Panel/)。此副本取自本地 FYSETC Docusaurus 参考项目，用于测试文档编辑和发布工作流程。更改仅限于文档分类、来源归属和翻译。原始仓库许可证保留在 `third-party/FYSETC-APACHE-LICENSE.txt` 中。
