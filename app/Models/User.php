<?php

namespace FlipPlay\Models;


class User
{
    private int $id;
    private string $name;
    private string $email;
    /** @var Media[] */
    private array $collection = [];

    public function __construct(int $id, string $name, string $email)
    {
        $this->id = $id;
        $this->name = $name;
        $this->email = $email;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    
    public function addMediaToCollection(Media $media): bool
    {
        if ($this->hasMedia($media->getId())) {
            return false;
        }

        $this->collection[$media->getId()] = $media;
        return true;
    }

    
    public function removeMediaFromCollection(int $mediaId): bool
    {
        if ($this->hasMedia($mediaId)) {
            unset($this->collection[$mediaId]);
            return true;
        }
        return false;
    }

    public function hasMedia(int $mediaId): bool
    {
        return isset($this->collection[$mediaId]);
    }

    /**
     * Mengambil seluruh daftar media dalam koleksi pengguna.
     * @return Media[]
     */
    public function getCollection(): array
    {
        return array_values($this->collection);
    }

    public function getCollectionCount(): int
    {
        return count($this->collection);
    }
}

