package com.example.humoji.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import androidx.recyclerview.widget.RecyclerView
import com.example.humoji.R
import com.example.humoji.models.HumojiItem

class HumojiAdapter(
    private val humojis: List<HumojiItem>,
    private val onHumojiClick: (HumojiItem) -> Unit
) : RecyclerView.Adapter<HumojiAdapter.HumojiViewHolder>() {

    class HumojiViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val imageView: ImageView = view.findViewById(R.id.humojiImage)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): HumojiViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_emoji, parent, false)
        return HumojiViewHolder(view)
    }

    override fun onBindViewHolder(holder: HumojiViewHolder, position: Int) {
        val humoji = humojis[position]
        holder.imageView.setImageBitmap(humoji.bitmap)
        holder.itemView.setOnClickListener { onHumojiClick(humoji) }
    }

    override fun getItemCount() = humojis.size
}