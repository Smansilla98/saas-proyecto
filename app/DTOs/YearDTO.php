<?php

namespace App\DTOs;

class YearDTO
{
    public function __construct(
        public string $name,
        public int $order,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            order: $data['order'],
        );
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'order' => $this->order,
        ];
    }
}

