package com.example.humoji

import android.graphics.Bitmap
import android.os.Bundle
import android.widget.SeekBar
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.humoji.databinding.ActivityEditBinding
import com.example.humoji.storage.HumojiStorage
import com.example.humoji.utils.ImageProcessor
import com.example.humoji.utils.ShareUtils

class EditActivity : AppCompatActivity() {
    private lateinit var binding: ActivityEditBinding
    private lateinit var originalBitmap: Bitmap
    private lateinit var processedBitmap: Bitmap
    private lateinit var imageProcessor: ImageProcessor
    private lateinit var humojiStorage: HumojiStorage
    
    private var currentStyle = "bubble"
    private var brightness = 1.0f
    private var contrast = 1.0f
    private var saturation = 1.0f

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityEditBinding.inflate(layoutInflater)
        setContentView(binding.root)

        imageProcessor = ImageProcessor()
        humojiStorage = HumojiStorage(this)

        // Get captured photo
        originalBitmap = intent.getParcelableExtra("photo_bitmap")
            ?: throw IllegalStateException("No photo provided")
        
        processedBitmap = originalBitmap.copy(Bitmap.Config.ARGB_8888, true)
        binding.previewImage.setImageBitmap(processedBitmap)

        setupUI()
        setupListeners()
        processImage()
    }

    private fun setupUI() {
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.title = "Edit Humoji"
    }

    private fun setupListeners() {
        binding.apply {
            // Style selection
            styleBubble.setOnClickListener { 
                currentStyle = "bubble"
                updateSelectedStyle()
                processImage()
            }
            styleMarble.setOnClickListener { 
                currentStyle = "marble"
                updateSelectedStyle()
                processImage()
            }
            styleClassic.setOnClickListener { 
                currentStyle = "classic"
                updateSelectedStyle()
                processImage()
            }

            // Adjustments
            brightnessSeekBar.setOnSeekBarChangeListener(createSeekBarListener { progress ->
                brightness = progress / 50f
                processImage()
            })

            contrastSeekBar.setOnSeekBarChangeListener(createSeekBarListener { progress ->
                contrast = progress / 50f
                processImage()
            })

            saturationSeekBar.setOnSeekBarChangeListener(createSeekBarListener { progress ->
                saturation = progress / 50f
                processImage()
            })

            // Buttons
            applyButton.setOnClickListener { processImage() }
            resetButton.setOnClickListener { resetAdjustments() }
            shareButton.setOnClickListener { shareHumoji() }
            saveButton.setOnClickListener { saveHumoji() }
        }
    }

    private fun createSeekBarListener(onProgressChanged: (Int) -> Unit) = object : SeekBar.OnSeekBarChangeListener {
        override fun onProgressChanged(seekBar: SeekBar?, progress: Int, fromUser: Boolean) {
            if (fromUser) onProgressChanged(progress)
        }
        override fun onStartTrackingTouch(seekBar: SeekBar?) {}
        override fun onStopTrackingTouch(seekBar: SeekBar?) {}
    }

    private fun updateSelectedStyle() {
        binding.apply {
            styleBubble.isSelected = currentStyle == "bubble"
            styleMarble.isSelected = currentStyle == "marble"
            styleClassic.isSelected = currentStyle == "classic"
        }
    }

    private fun processImage() {
        processedBitmap = imageProcessor.processImage(
            originalBitmap,
            currentStyle,
            brightness,
            contrast,
            saturation
        )
        binding.previewImage.setImageBitmap(processedBitmap)
    }

    private fun resetAdjustments() {
        binding.apply {
            brightnessSeekBar.progress = 50
            contrastSeekBar.progress = 50
            saturationSeekBar.progress = 50
        }
        brightness = 1.0f
        contrast = 1.0f
        saturation = 1.0f
        processImage()
    }

    private fun shareHumoji() {
        ShareUtils.shareHumoji(this, processedBitmap)
    }

    private fun saveHumoji() {
        try {
            val id = humojiStorage.saveHumoji(processedBitmap, currentStyle)
            Toast.makeText(this, "Humoji saved!", Toast.LENGTH_SHORT).show()
            finish()
        } catch (e: Exception) {
            Toast.makeText(this, "Failed to save humoji", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }
}