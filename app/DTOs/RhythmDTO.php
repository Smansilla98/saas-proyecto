<?php

namespace App\DTOs;

class RhythmDTO
{
    public function __construct(
        public string $name,
        public int $yearId,
        public ?string $description = null,
        public ?string $author = null,
        public ?string $adaptation = null,
        public bool $optional = false,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            yearId: $data['year_id'],
            description: $data['description'] ?? null,
            author: $data['author'] ?? null,
            adaptation: $data['adaptation'] ?? null,
            optional: $data['optional'] ?? false,
        );
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'year_id' => $this->yearId,
            'description' => $this->description,
            'author' => $this->author,
            'adaptation' => $this->adaptation,
            'optional' => $this->optional,
        ];
    }
}

