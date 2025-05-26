package com.example.humoji.models

import android.graphics.Bitmap

data class HumojiItem(
    val id: String,
    val bitmap: Bitmap,
    val style: String,
    val createdAt: Long
)