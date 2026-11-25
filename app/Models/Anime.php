<?php

namespace FlipPlay\Models;


class Anime extends Media
{
    private int $episodes;
    private string $studio;

    public function __construct(
        int $id,
        string $title,
        array $genres,
        float $rating,
        int $year,
        string $synopsis,
        int $episodes,
        string $studio
    ) {
        parent::__construct($id, $title, 'Anime', $genres, $rating, $year, $synopsis);
        $this->episodes = $episodes;
        $this->studio = $studio;
    }

    public function getEpisodes(): int
    {
        return $this->episodes;
    }

    public function getStudio(): string
    {
        return $this->studio;
    }

    public function getDetails(): string
    {
        $details = "========================================\n";
        $details .= "  DETAIL MEDIA ANIME: {$this->title}\n";
        $details .= "========================================\n";
        $details .= "ID           : {$this->id}\n";
        $details .= "Tipe         : {$this->type} (Video Streaming)\n";
        $details .= "Tahun Rilis  : {$this->year}\n";
        $details .= "Studio       : {$this->studio}\n";
        $details .= "Jumlah Ep    : {$this->episodes} Episode\n";
        $details .= "Genre        : {$this->getGenresAsString()}\n";
        $details .= "Rating       : {$this->rating} / 10\n";
        $details .= "Sinopsis     : {$this->synopsis}\n";
        $details .= "Format       : High-Definition Video Stream\n";
        $details .= "========================================";

        return $details;
    }
}

