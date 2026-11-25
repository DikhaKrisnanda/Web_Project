<?php

namespace FlipPlay\Models;


abstract class Media
{
    protected int $id;
    protected string $title;
    protected string $type;
    protected array $genres;
    protected float $rating;
    protected int $year;
    protected string $synopsis;

    public function __construct(
        int $id,
        string $title,
        string $type,
        array $genres,
        float $rating,
        int $year,
        string $synopsis
    ) {
        $this->id = $id;
        $this->title = $title;
        $this->type = $type;
        $this->genres = $genres;
        $this->rating = $rating;
        $this->year = $year;
        $this->synopsis = $synopsis;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function getType(): string
    {
        return $this->type;
    }

    public function getGenres(): array
    {
        return $this->genres;
    }

    public function getGenresAsString(): string
    {
        return implode(', ', $this->genres);
    }

    public function getRating(): float
    {
        return $this->rating;
    }

    public function getYear(): int
    {
        return $this->year;
    }

    public function getSynopsis(): string
    {
        return $this->synopsis;
    }

    public function getSummary(): string
    {
        return sprintf(
            "[%d] %s (%d) | Tipe: %s | Genre: %s | Rating: %.1f/10",
            $this->id,
            $this->title,
            $this->year,
            $this->type,
            $this->getGenresAsString(),
            $this->rating
        );
    }

    /**
     * Method abstrak yang wajib diimplementasikan oleh setiap subclass (Anime, Manga, Drama).
     */
    abstract public function getDetails(): string;
}

