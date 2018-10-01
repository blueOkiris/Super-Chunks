#!/bin/bash

gcc `pkg-config --cflags gtk+-3.0` -o level-editor main.c `pkg-config --libs gtk+-3.0`
