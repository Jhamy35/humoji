package com.example.humoji.utils

import android.graphics.*
import android.graphics.Bitmap.Config
import android.graphics.PorterDuff.Mode
import androidx.core.graphics.scale
import kotlin.math.min

class ImageProcessor {
    fun processImage(bitmap: Bitmap, style: String, brightness: Float, contrast: Float, saturation: Float): Bitmap {
        var processed = bitmap.copy(Config.ARGB_8888, true)
        
        // Resize and crop to square
        processed = cropToSquare(processed)
        
        // Apply adjustments
        processed = adjustImage(processed, brightness, contrast, saturation)
        
        // Apply style effects
        processed = when (style) {
            "bubble" -> applyBubbleStyle(processed)
            "marble" -> applyMarbleStyle(processed)
            "classic" -> applyClassicStyle(processed)
            else -> processed
        }
        
        // Apply circular mask
        return applyCircularMask(processed)
    }
    
    private fun cropToSquare(bitmap: Bitmap): Bitmap {
        val size = min(bitmap.width, bitmap.height)
        val x = (bitmap.width - size) / 2
        val y = (bitmap.height - size) / 2
        
        return Bitmap.createBitmap(bitmap, x, y, size, size)
    }
    
    private fun adjustImage(bitmap: Bitmap, brightness: Float, contrast: Float, saturation: Float): Bitmap {
        val paint = Paint()
        val canvas = Canvas(bitmap)
        
        val colorMatrix = ColorMatrix()
        colorMatrix.setSaturation(saturation)
        
        val brightnessMatrix = ColorMatrix(floatArrayOf(
            1f, 0f, 0f, 0f, brightness * 255,
            0f, 1f, 0f, 0f, brightness * 255,
            0f, 0f, 1f, 0f, brightness * 255,
            0f, 0f, 0f, 1f, 0f
        ))
        
        val contrastMatrix = ColorMatrix(floatArrayOf(
            contrast, 0f, 0f, 0f, 0f,
            0f, contrast, 0f, 0f, 0f,
            0f, 0f, contrast, 0f, 0f,
            0f, 0f, 0f, 1f, 0f
        ))
        
        colorMatrix.postConcat(brightnessMatrix)
        colorMatrix.postConcat(contrastMatrix)
        
        paint.colorFilter = ColorMatrixColorFilter(colorMatrix)
        canvas.drawBitmap(bitmap, 0f, 0f, paint)
        
        return bitmap
    }
    
    private fun applyBubbleStyle(bitmap: Bitmap): Bitmap {
        val paint = Paint()
        paint.colorFilter = LightingColorFilter(0xFF9EDBFF.toInt(), 0)
        val canvas = Canvas(bitmap)
        canvas.drawBitmap(bitmap, 0f, 0f, paint)
        return bitmap
    }
    
    private fun applyMarbleStyle(bitmap: Bitmap): Bitmap {
        val paint = Paint()
        paint.colorFilter = LightingColorFilter(0xFFE0E0E0.toInt(), 0)
        val canvas = Canvas(bitmap)
        canvas.drawBitmap(bitmap, 0f, 0f, paint)
        return bitmap
    }
    
    private fun applyClassicStyle(bitmap: Bitmap): Bitmap {
        val paint = Paint()
        val canvas = Canvas(bitmap)
        paint.colorFilter = LightingColorFilter(0xFFFFF0E0.toInt(), 0)
        canvas.drawBitmap(bitmap, 0f, 0f, paint)
        return bitmap
    }
    
    private fun applyCircularMask(bitmap: Bitmap): Bitmap {
        val output = Bitmap.createBitmap(bitmap.width, bitmap.height, Config.ARGB_8888)
        val canvas = Canvas(output)
        val paint = Paint()
        val rect = Rect(0, 0, bitmap.width, bitmap.height)
        
        paint.isAntiAlias = true
        canvas.drawARGB(0, 0, 0, 0)
        canvas.drawCircle(
            bitmap.width / 2f,
            bitmap.height / 2f,
            bitmap.width / 2f,
            paint
        )
        
        paint.xfermode = PorterDuffXfermode(Mode.SRC_IN)
        canvas.drawBitmap(bitmap, rect, rect, paint)
        
        return output
    }
}