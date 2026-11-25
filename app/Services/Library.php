<?php

namespace FlipPlay\Services;

use FlipPlay\Models\Media;

/**
 * Class Library
 * Mengelola katalog dan perpustakaan seluruh konten media di FlipPlay.
 */
class Library
{
    /** @var Media[] */
    private array $mediaList = [];

    public function __construct()
    {
        $this->mediaList = [];
    }

    /**
     * Menambahkan media baru ke dalam library.
     */
    public function addMedia(Media $media): void
    {
        $this->mediaList[$media->getId()] = $media;
    }

    /**
     * Mengambil seluruh media yang ada di library.
     * @return Media[]
     */
    public function getAllMedia(): array
    {
        return array_values($this->mediaList);
    }

    /**
     * Mencari media berdasarkan kata kunci pada judul (case-insensitive).
     * @return Media[]
     */
    public function findMediaByTitle(string $keyword): array
    {
        $keyword = strtolower(trim($keyword));
        if ($keyword === '') {
            return [];
        }

        $results = [];
        foreach ($this->mediaList as $media) {
            if (str_contains(strtolower($media->getTitle()), $keyword)) {
                $results[] = $media;
            }
        }

        return $results;
    }

    /**
     * Mengambil detail media berdasarkan ID unik.
     */
    public function getMediaById(int $id): ?Media
    {
        return $this->mediaList[$id] ?? null;
    }

    /**
     * Memfilter media berdasarkan tipe (misal: 'Anime', 'Manga', 'Drama').
     * @return Media[]
     */
    public function filterByType(string $type): array
    {
        $type = strtolower(trim($type));
        $results = [];

        foreach ($this->mediaList as $media) {
            if (strtolower($media->getType()) === $type) {
                $results[] = $media;
            }
        }

        return $results;
    }

    public function getTotalCount(): int
    {
        return count($this->mediaList);
    }
}

