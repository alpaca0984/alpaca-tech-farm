---
title: Set up Raspberry Pi 3 and LED Blinking
date: 2017-09-18 17:23:04
tags:
  - Raspberry Pi
  - Python
---

Recently I bought a Raspberry Pi 3(RPi3).
This is my first time to play with one.

# Install OS image

I installed latest Raspbian(an OS for RPi) following this link.
https://www.raspberrypi.org/documentation/installation/installing-images/README.md

# Set up SSH in RPi

It was totally easy.
https://www.raspberrypi.org/documentation/remote-access/ssh/

Then, I've been able to connect RPi from my mac's terminal.

<!-- put a picture of terminal -->

# Turn on LED without any programming

These are required.
- Breadboard * 1
- LED * 1
- Resistor(I used 220Ω) * 1
- Jumper wires(Male-to-Female) * 2

The one of pins of RPi persistently outputs 3.3V electricity.
So I use it for DC power.

LED has two leads, longer one and shorter one.
The longer one is positive.

Here are steps to turn on LED.

1. Set 2 female wires to RPi