<?php

namespace FlipPlay\Models;


class Drama extends Media
{
    private int $episodes;
    private string $network;
    private string $country;

    public function __construct(
        int $id,
        string $title,
        array $genres,
        float $rating,
        int $year,
        string $synopsis,
        int $episodes,
        string $network,
        string $country
    ) {
        parent::__construct($id, $title, 'Drama', $genres, $rating, $year, $synopsis);
        $this->episodes = $episodes;
        $this->network = $network;
        $this->country = $country;
    }

    public function getEpisodes(): int
    {
        return $this->episodes;
    }

    public function getNetwork(): string
    {
        return $this->network;
    }

    public function getCountry(): string
    {
        return $this->country;
    }

    public function getDetails(): string
    {
        $details = "========================================\n";
        $details .= "  DETAIL MEDIA DRAMA: {$this->title}\n";
        $details .= "========================================\n";
        $details .= "ID           : {$this->id}\n";
        $details .= "Tipe         : {$this->type} (Live Action Series)\n";
        $details .= "Negara Asal  : {$this->country}\n";
        $details .= "Tahun Rilis  : {$this->year}\n";
        $details .= "Jaringan/TV  : {$this->network}\n";
        $details .= "Jumlah Ep    : {$this->episodes} Episode\n";
        $details .= "Genre        : {$this->getGenresAsString()}\n";
        $details .= "Rating       : {$this->rating} / 10\n";
        $details .= "Sinopsis     : {$this->synopsis}\n";
        $details .= "Format       : High-Definition Live-Action Stream\n";
        $details .= "========================================";

        return $details;
    }
}

