---
title: H.264 入门篇 - 14 (去块滤波)
type: book-zh-cn
order: 0
---
# H.264 入门篇 - 14 (去块滤波)
**目录**

H264视频编码标准中，在解码器反变换量化后会出现块效应。

<img alt="" height="310" src="images/H.264 入门篇 - 14 (去块滤波)/b3cf3dd3ac8a43ee5f97863c31d77272.png" width="246">

## 1、产生的原因
1. 量化过程是有损的，会引入误差。变换系数的量化过程相对粗糙，因而反量化过程恢复的变换系数带有误差，会造成图像块边界上视觉不连续；1. 运动补偿预测。运动补偿是从不同帧的不同位置上内插采样点数据复制而来。因为运动补偿块的匹配不可能绝对准确，所以会在边界上产生数据不连续。
因此，需要一个去块滤波器改善画面质量。

## 2、去块滤波的作用

核心作用在于消除编码过程中产生的图像块效应；

## 3、去块滤波的执行过程

### 3.1、概念

去块滤波对于每一个宏块的亮度和色度分量分别进行

对于宏块的每一个分量的滤波过程分为两个方向：（先是垂直方向再是水平方向）

垂直方向：垂直方向的滤波从左向右进行

水平方向：水平方向的滤波从上向下进行

<img alt="" height="429" src="images/H.264 入门篇 - 14 (去块滤波)/b0df877323f0458148aab8ccef1e9dff.png" width="825">

上图整体表示一个16x16的宏块，每个小框表示的是子块，左边表示垂直方向的边沿，右边表示水平方向的边沿，实线表示半宏块的边沿，虚线表示1/4宏块的边沿。

对于亮度/色度以及不同的参数设置，去块滤波操作的边沿不同。

对于亮度分量，根据 transform_size_8x8_flag（宏块信息中）的值判断：
- 如果transform_size_8x8_flag为0，即采用4×4尺寸变换，对实线和虚线的边沿进行滤波；- 如果transform_size_8x8_flag为1，即采用8×8尺寸变换，只对实线的块边沿进行滤波；
对于色度分量，只考虑4:2:0格式，只对半宏块边沿即实线部分进行滤波。

### 3.2、宏块去块滤波的过程

去块滤波以16x16宏块为单位，对每个4x4块或8x8块边界进行滤波。滤波过程包括边界分析和滤波运算两部分。边界分析主要解决两个问题：
- 计算边界强度，对不同强度边界采用不同强度的滤波，如果强度不够则滤波效果不好，块效应依然明显，强度太大则图像细节损失太多，影响视频主管效果；- 解决真假边界问题，视频图像中有可能物体的边界刚好在两块的边界上，在做去块效应滤波时当然不希望把物体的边界轮廓弄得模糊，因此需要判断真假边界
#### 3.2.1、计算边界强度

对4x4块定义边界强度，设P块和Q块为两相邻块，按下表决定边缘强度
| 判断条件 | 边界强度 (BS) 

边界强度 (BS)
| P 块或 Q 块为帧内编码模式，且块边缘为宏块边缘 | 4 

4
| P 块或 Q 块为帧内编码模式 | 3 

3
| P 块或 Q 块的残差变换系数不都为 0 | 2 

2
| P 块或 Q 块的残差变换系数都为 0，但 P 块和 Q 块参考帧或运动项目不同 | 1 

1
| P 块或 Q 块的残差变换系数都为 0，但 P 块和 Q 块参考帧或运动项目相同 | 0 

0

色度块的边界不需要单独计算，直接等于对应亮度块的边界强度。

#### 3.2.2、区分真假边界

去块滤波最核心部分就是区分真假边界，关于真假边界区分是基于两个假设：
- 真实边界两边像素点的差值通常比虚假边界两边像素差值要大；- 对于两边像素差值小的真实边界，即使使用平滑滤波，其主观效果也不会有太大的影响。
因此，去块滤波应该遵循以下原则：
- 在平坦区域，即使很小的像素不连续也很容易被人察觉，所以要使用比较强的去块滤波，可以改变较多的像素点- 对于复杂的区域，为了保持图像细节，要使用较弱的去块滤波，改变较少的像素点
为区分真假边界，需要对被滤波边界两边的像素值进行分析。定义两个相邻4x4块中一条直线上的采样点为p3、p2、p1、p0、q0、q1、q2、q3，如下图所示。

<img alt="" height="183" src="images/H.264 入门篇 - 14 (去块滤波)/363d3b97aed01d323b759313e5f8cee3.png" width="1135">

H264标准中设定了两个阈值 α(alpha) 和 β(beta) 来判断虚假边界

α(alpha) 表示块与块之间的边界阈值；

β(beta) 表示块内边界的阈值。

对于边界两边像素点的差值，满足下面三个条件就判定为需要滤波的虚假边界。

>  
 | p0-q0 | &lt; α 
 | p1-p0 | &lt; β 
 | q1-q0 | &lt; β 


## 4、滤波运算

当边界强度BS不为0时，就需要进行滤波。H.264 的边缘滤波有两种滤波器：

### 4.1、BS &lt; 4

BS &lt; 4 时采用强度较弱的滤波器，首先改变p0、q0两个像素点，接着用阈值 β(beta) 判断是否需要调整p1、q1的值；过程如下

首先对边界上的两个像素点p0与q0进行滤波，它需要输入p1、p0、q0、q1，滤波过程如下：

<img alt="" height="450" src="images/H.264 入门篇 - 14 (去块滤波)/b261f764c0737964fa8d4e19199c7d6b.png" width="909">
1. 先要得到差值Δ，差值的计算方式：Δ = ( (q0-p0)&gt; 31. 然后需要对差值Δ进行限幅，保证这个差值在一定的范围内，这个范围主要通过查表得到，详情请查看标准8.7.2.31. 用差值Δ来计算新的p0、q0，也就是滤波后的值
接下来对块内的像素点p1与q1分别进行滤波。4:2:0以及4:2:2色度宏块边界的话是不需要执行这部分的滤波的。如果是要计算p1，则需要输入p2、p1、p0、q0；如果是q1，则需要输入p0、q0、q1、q2。

另外，只有满足|p2-p0|

<img alt="" height="427" src="images/H.264 入门篇 - 14 (去块滤波)/bd170f09b8dd69f2243e21f186463ca8.png" width="1022">
1. 先要得到差值Δ，差值的计算方式为：Δ = ( p2 + ((p0+q0+1)&gt;&gt;1) − (p1&gt; 11. 然后需要对差值Δ进行限幅，保证这个差值在一定范围内，这个范围主要通过查表得到，详情请查看标准8.7.2.31. 用差值来计算新的p1


q1的滤波过程也是类似的步骤。

### 4.2、BS = 4

BS = 4 时有两种强度的滤波，强滤波可以改变6个像素点（p0、p1、p2、q0、q1、q2），弱滤波只改变边界上的两个点（p0、q0）

在h.264的帧内预测编码中，倾向于对纹理简单的区域用16x16亮度预测模式编码（如蓝天、白色墙面等），以达到快速编码的目的。虽然这种方法只会在宏块边界引起轻微的块效应，但是在这种情况下，即使很小的强度值查表也会在视觉上产生陡峭的阶梯状的感觉（色块分层），因而对于这种内容平滑的宏块边界就需要采用较强的滤波器；如果此时宏块边界有大量的细节存在，反而不应做强滤波。对此h.264仍采用阈值法来判断是否存在真实边界，如果不存在大量细节信息，可以做强滤波，反之做弱滤波。

这里的滤波是比较好理解的抽头滤波器，P、Q块上的滤波过程差不多，这里以P块为例。

对于P块的点，如果满足下式，则认为细节信息不多：

<img alt="" height="62" src="images/H.264 入门篇 - 14 (去块滤波)/9e919ffbf000f1f4400e0374dbe60c53.png" width="269">

采用强滤波

<img alt="" height="83" src="images/H.264 入门篇 - 14 (去块滤波)/94f68c7d515180dec747419c66205901.png" width="390">

否则采用弱滤波，只改变p0点

<img alt="" height="40" src="images/H.264 入门篇 - 14 (去块滤波)/76a33d29c0487ecc87abd5689d971bae.png" width="274">

参考：

详细运算过程参考 H.264 的 8.7.2.3 和 8.7.2.4 节
