<?php

namespace FlipPlay\Models;


class Manga extends Media
{
    private int $chapters;
    private string $author;

    public function __construct(
        int $id,
        string $title,
        array $genres,
        float $rating,
        int $year,
        string $synopsis,
        int $chapters,
        string $author
    ) {
        parent::__construct($id, $title, 'Manga', $genres, $rating, $year, $synopsis);
        $this->chapters = $chapters;
        $this->author = $author;
    }

    public function getChapters(): int
    {
        return $this->chapters;
    }

    public function getAuthor(): string
    {
        return $this->author;
    }

    public function getDetails(): string
    {
        $details = "========================================\n";
        $details .= "  DETAIL MEDIA MANGA: {$this->title}\n";
        $details .= "========================================\n";
        $details .= "ID           : {$this->id}\n";
        $details .= "Tipe         : {$this->type} (Digital Reading)\n";
        $details .= "Tahun Rilis  : {$this->year}\n";
        $details .= "Pengarang    : {$this->author}\n";
        $details .= "Jumlah Bab   : {$this->chapters} Chapter\n";
        $details .= "Genre        : {$this->getGenresAsString()}\n";
        $details .= "Rating       : {$this->rating} / 10\n";
        $details .= "Sinopsis     : {$this->synopsis}\n";
        $details .= "Format       : Interactive E-Reader & Scans\n";
        $details .= "========================================";

        return $details;
    }
}

