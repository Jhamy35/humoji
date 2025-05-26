package com.example.humoji.storage

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import com.example.humoji.models.HumojiItem
import java.io.File
import java.io.FileOutputStream

class HumojiStorage(private val context: Context) {
    private val storageDir: File
        get() = File(context.filesDir, "humojis").apply { mkdirs() }

    fun saveHumoji(bitmap: Bitmap, style: String): String {
        val id = System.currentTimeMillis().toString()
        val imageFile = File(storageDir, "${id}.png")
        val metadataFile = File(storageDir, "${id}.json")

        FileOutputStream(imageFile).use { out ->
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, out)
        }

        val metadata = """
            {
                "id": "$id",
                "style": "$style",
                "createdAt": ${System.currentTimeMillis()}
            }
        """.trimIndent()

        metadataFile.writeText(metadata)

        return id
    }

    fun getHumoji(id: String): HumojiItem? {
        val imageFile = File(storageDir, "${id}.png")
        val metadataFile = File(storageDir, "${id}.json")

        if (!imageFile.exists() || !metadataFile.exists()) return null

        val bitmap = BitmapFactory.decodeFile(imageFile.absolutePath)
        val metadata = metadataFile.readText()
        
        // Simple JSON parsing without external dependencies
        val style = metadata.substringAfter("\"style\": \"").substringBefore("\"")
        val createdAt = metadata.substringAfter("\"createdAt\": ").substringBefore("}")
            .toLongOrNull() ?: System.currentTimeMillis()

        return HumojiItem(id, bitmap, style, createdAt)
    }

    fun getAllHumojis(): List<HumojiItem> {
        return storageDir.listFiles { file -> file.extension == "png" }
            ?.mapNotNull { file ->
                val id = file.nameWithoutExtension
                getHumoji(id)
            }
            ?.sortedByDescending { it.createdAt }
            ?: emptyList()
    }

    fun deleteHumoji(id: String): Boolean {
        val imageFile = File(storageDir, "${id}.png")
        val metadataFile = File(storageDir, "${id}.json")
        
        return imageFile.delete() && metadataFile.delete()
    }
}