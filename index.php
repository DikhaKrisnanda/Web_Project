<?php


namespace FlipPlay\Models {

    
    abstract class Media
    {
        protected int $id;
        protected string $title;
        protected string $category;
        protected array $genres;
        protected float $rating;
        protected int $year;
        protected string $synopsis;

        public function __construct(
            int $id,
            string $title,
            string $category,
            array $genres,
            float $rating,
            int $year,
            string $synopsis
        ) {
            $this->id = $id;
            $this->title = $title;
            $this->category = $category;
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

        public function getCategory(): string
        {
            return $this->category;
        }

        public function getGenres(): array
        {
            return $this->genres;
        }

        public function getGenresFormatted(): string
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

        
        abstract public function getSpecification(): string;
    }

    
    class Anime extends Media
    {
        private int $episodeCount;
        private string $studio;

        public function __construct(
            int $id,
            string $title,
            array $genres,
            float $rating,
            int $year,
            string $synopsis,
            int $episodeCount,
            string $studio
        ) {
            parent::__construct($id, $title, 'Anime', $genres, $rating, $year, $synopsis);
            $this->episodeCount = $episodeCount;
            $this->studio = $studio;
        }

        public function getEpisodeCount(): int
        {
            return $this->episodeCount;
        }

        public function getStudio(): string
        {
            return $this->studio;
        }

        public function getSpecification(): string
        {
            return sprintf("%d Episodes | Studio: %s", $this->episodeCount, $this->studio);
        }
    }


    class Manga extends Media
    {
        private int $chapterCount;
        private string $author;

        public function __construct(
            int $id,
            string $title,
            array $genres,
            float $rating,
            int $year,
            string $synopsis,
            int $chapterCount,
            string $author
        ) {
            parent::__construct($id, $title, 'Manga', $genres, $rating, $year, $synopsis);
            $this->chapterCount = $chapterCount;
            $this->author = $author;
        }

        public function getChapterCount(): int
        {
            return $this->chapterCount;
        }

        public function getAuthor(): string
        {
            return $this->author;
        }

        public function getSpecification(): string
        {
            return sprintf("%d Chapters | Author: %s", $this->chapterCount, $this->author);
        }
    }

    /**
     * Class: User
     */
    class User
    {
        private int $id;
        private string $username;
        private string $email;
        /** @var Media[] */
        private array $watchlist = [];

        public function __construct(int $id, string $username, string $email)
        {
            $this->id = $id;
            $this->username = $username;
            $this->email = $email;
        }

        public function getId(): int
        {
            return $this->id;
        }

        public function getUsername(): string
        {
            return $this->username;
        }

        public function getEmail(): string
        {
            return $this->email;
        }

        public function addToWatchlist(Media $media): bool
        {
            if (isset($this->watchlist[$media->getId()])) {
                return false;
            }
            $this->watchlist[$media->getId()] = $media;
            return true;
        }

        /**
         * @return Media[]
         */
        public function getWatchlist(): array
        {
            return array_values($this->watchlist);
        }

        public function getWatchlistCount(): int
        {
            return count($this->watchlist);
        }
    }
}

namespace FlipPlay\Services {

    use FlipPlay\Models\Media;


    class MediaEngine
    {
        /** @var array<int, Media> */
        private array $repository = [];

        public function registerMedia(Media $media): void
        {
            $this->repository[$media->getId()] = $media;
        }

        /**
         * @return Media[]
         */
        public function getAllMedia(): array
        {
            return array_values($this->repository);
        }

        /**
         * @return Media[]
         */
        public function searchByTitle(string $keyword): array
        {
            $keyword = strtolower(trim($keyword));
            if ($keyword === '') {
                return [];
            }

            $matched = [];
            foreach ($this->repository as $media) {
                if (str_contains(strtolower($media->getTitle()), $keyword)) {
                    $matched[] = $media;
                }
            }
            return $matched;
        }

        public function getMediaById(int $id): ?Media
        {
            return $this->repository[$id] ?? null;
        }

        public function count(): int
        {
            return count($this->repository);
        }
    }
}

namespace {

    use FlipPlay\Models\Anime;
    use FlipPlay\Models\Manga;
    use FlipPlay\Models\User;
    use FlipPlay\Services\MediaEngine;

    

    echo "==================================================\n";
    echo "FLIPPLAY BACKEND ENGINE - CLI SIMULATION\n";
    echo "==================================================\n";
    echo "[INFO] Engine runtime initialized (PHP " . PHP_VERSION . ")\n";

    $engine = new MediaEngine();
    $user   = new User(1, "Dikha Krisnanda", "dikha@flipplay.local");

    echo "[INFO] Active session user: {$user->getUsername()} ({$user->getEmail()})\n";

    
    echo "\n--------------------------------------------------\n";
    echo "01. REGISTRASI MEDIA KE REPOSITORY\n";
    echo "--------------------------------------------------\n";

    $itemsToRegister = [
        new Anime(
            1,
            "Naruto Shippuden",
            ["Shonen", "Aksi", "Ninja", "Adventure"],
            9.9,
            2007,
            "Perjalanan Uzumaki Naruto menguasai jurus Rasengan dan cakra Kurama demi melindungi desa Konoha.",
            500,
            "Studio Pierrot"
        ),
        new Anime(
            2,
            "Attack on Titan: The Final Season",
            ["Aksi", "Militer", "Misteri", "Dark Fantasy"],
            9.8,
            2023,
            "Pertempuran penentuan antara pulau Paradis dan kekaisaran Marley ketika rahasia Titan terungkap.",
            87,
            "MAPPA"
        ),
        new Manga(
            3,
            "Solo Leveling: Arise",
            ["Aksi", "Leveling", "Dungeon", "Super Power"],
            9.7,
            2022,
            "Sung Jin-Woo, hunter terlemah berperingkat E, terpilih menjadi Player tunggal dengan kenaikan level tanpa batas.",
            179,
            "Chugong & DUBU"
        ),
        new Manga(
            4,
            "One Piece",
            ["Shonen", "Adventure", "Fantasy", "Comedy"],
            9.9,
            1997,
            "Monkey D. Luffy bersama kru Bajak Laut Topi Jerami mengarungi lautan mencari harta karun One Piece.",
            1100,
            "Eiichiro Oda"
        ),
        new Anime(
            5,
            "Spy x Family",
            ["Action", "Comedy", "Spy"],
            9.2,
            2022,
            "Agen rahasia Twilight harus membangun keluarga samaran demi menjalankan misi perdamaian dunia.",
            25,
            "Wit Studio / CloverWorks"
        ),
    ];

    foreach ($itemsToRegister as $item) {
        $engine->registerMedia($item);
        printf("[+] Media registered: [%-5s] %-35s (ID: %d)\n", $item->getCategory(), $item->getTitle(), $item->getId());
    }

    printf("[INFO] Total media in repository: %d items.\n", $engine->count());

    
    echo "\n--------------------------------------------------\n";
    echo "02. KATALOG MEDIA TERSEDIA\n";
    echo "--------------------------------------------------\n";
    printf("%-4s %-38s %-10s %-8s %-6s\n", "ID", "Title", "Category", "Rating", "Year");
    echo "--------------------------------------------------\n";

    foreach ($engine->getAllMedia() as $media) {
        printf(
            "%-4s %-38s %-10s %-8s %-6s\n",
            sprintf("%02d", $media->getId()),
            $media->getTitle(),
            $media->getCategory(),
            sprintf("%.1f/10", $media->getRating()),
            $media->getYear()
        );
    }

    
    echo "\n--------------------------------------------------\n";
    echo "03. PENCARIAN MEDIA BERDASARKAN JUDUL\n";
    echo "--------------------------------------------------\n";

    $queries = ["Titan", "Piece", "Cyberpunk"];

    foreach ($queries as $query) {
        echo "[>] Query: \"{$query}\"\n";
        $results = $engine->searchByTitle($query);

        if (empty($results)) {
            echo "    [!] No media found matching query.\n";
        } else {
            foreach ($results as $res) {
                printf(
                    "    Matched: [ID: %02d] %s (%s, %d) - %.1f/10\n",
                    $res->getId(),
                    $res->getTitle(),
                    $res->getCategory(),
                    $res->getYear(),
                    $res->getRating()
                );
            }
        }
    }

    
    echo "\n--------------------------------------------------\n";
    echo "04. DETAIL INFORMASI OBJEK MEDIA\n";
    echo "--------------------------------------------------\n";

    $detailIds = [1, 3];

    foreach ($detailIds as $id) {
        $media = $engine->getMediaById($id);
        if ($media === null) {
            continue;
        }

        echo "[DETAIL] Object ID: {$media->getId()}\n";
        printf("  %-15s : %s\n", "Title", $media->getTitle());
        printf("  %-15s : %s\n", "Category", $media->getCategory());
        printf("  %-15s : %d\n", "Year", $media->getYear());
        printf("  %-15s : %.1f/10\n", "Rating", $media->getRating());
        printf("  %-15s : %s\n", "Genres", $media->getGenresFormatted());
        printf("  %-15s : %s\n", "Specification", $media->getSpecification());
        printf("  %-15s : %s\n", "Synopsis", $media->getSynopsis());
        echo "\n";
    }

    // ------------------------------------------------------------------------
    // 05. WATCHLIST PENGGUNA
    // ------------------------------------------------------------------------
    echo "--------------------------------------------------\n";
    echo "05. WATCHLIST & KOLEKSI PENGGUNA\n";
    echo "--------------------------------------------------\n";

    $watchlistCandidates = [1, 3];
    foreach ($watchlistCandidates as $cid) {
        $candidate = $engine->getMediaById($cid);
        if ($candidate !== null) {
            $user->addToWatchlist($candidate);
            printf("[+] Added to watchlist: %s\n", $candidate->getTitle());
        }
    }

    echo "\nUser: {$user->getUsername()} ({$user->getWatchlistCount()} items in watchlist)\n";
    printf("%-4s %-38s %-10s %-8s\n", "ID", "Title", "Category", "Rating");
    echo "--------------------------------------------------\n";

    foreach ($user->getWatchlist() as $watchItem) {
        printf(
            "%-4s %-38s %-10s %-8s\n",
            sprintf("%02d", $watchItem->getId()),
            $watchItem->getTitle(),
            $watchItem->getCategory(),
            sprintf("%.1f/10", $watchItem->getRating())
        );
    }

    echo "\n==================================================\n";
    echo "Simulasi selesai.\n";
    echo "==================================================\n";
}
