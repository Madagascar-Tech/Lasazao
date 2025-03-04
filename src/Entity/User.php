<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Delete;
use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Doctrine\ORM\Event\PrePersistEventArgs;
use Doctrine\ORM\Event\PreUpdateEventArgs;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ApiResource(
    shortName: 'Admin',
    operations: [
        new GetCollection(
            uriTemplate: '/admin/users',
            description: 'Récupère la liste des utilisateurs',
            security: "is_granted('ROLE_ADMIN')",
            securityMessage: "Seuls les administrateurs peuvent voir la liste des utilisateurs"
        ),
        new Post(
            uriTemplate: '/admin/users',
            description: 'Crée un nouvel utilisateur',
            security: "is_granted('ROLE_ADMIN')",
            securityMessage: "Seuls les administrateurs peuvent créer des utilisateurs",
            validationContext: ['groups' => ['Default', 'user:create']],
            name: 'create_user'
        ),
        new Delete(
            uriTemplate: '/admin/users/{id}',
            description: 'Supprime un utilisateur (sauf admin)',
            security: "is_granted('ROLE_ADMIN') and !object.isAdmin()",
            securityMessage: "L'administrateur ne peut pas être supprimé"
        )
    ],
    normalizationContext: ['groups' => ['user:read']],
    denormalizationContext: ['groups' => ['user:write']]
)]
#[ORM\HasLifecycleCallbacks]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[ApiProperty(description: 'L\'identifiant unique de l\'utilisateur')]
    private ?int $id = null;

    #[Groups(['user:read', 'user:write'])]
    #[ORM\Column(length: 180, unique: true)]
    #[Assert\NotBlank]
    #[Assert\Email]
    #[ApiProperty(description: 'L\'email de l\'utilisateur')]
    private ?string $email = null;

    #[Groups(['user:read'])]
    #[ORM\Column]
    #[ApiProperty(description: 'Les rôles de l\'utilisateur')]
    private array $roles = [];

    #[Groups(['user:write'])]
    #[ORM\Column]
    #[ApiProperty(description: 'Le mot de passe hashé de l\'utilisateur')]
    private ?string $password = null;

    #[Groups(['user:read', 'user:write'])]
    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[ApiProperty(description: 'Le prénom de l\'utilisateur')]
    private ?string $firstName = null;

    #[Groups(['user:read', 'user:write'])]
    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[ApiProperty(description: 'Le nom de famille de l\'utilisateur')]
    private ?string $lastName = null;

    #[Groups(['user:write'])]
    #[Assert\NotBlank(groups: ['user:create'])]
    #[Assert\Length(min: 6)]
    private ?string $plainPassword = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;
        // Garantit que chaque utilisateur a au moins ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        // Empêcher l'ajout du rôle ADMIN via l'API
        $roles = array_filter($roles, fn($role) => $role !== 'ROLE_ADMIN');
        $this->roles = $roles;
        return $this;
    }

    // Méthode pour faciliter l'ajout d'un rôle admin
    public function makeAdmin(): self
    {
        $this->roles = ['ROLE_ADMIN'];
        return $this;
    }

    // Méthode pour vérifier si l'utilisateur est admin
    public function isAdmin(): bool
    {
        return in_array('ROLE_ADMIN', $this->roles);
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): static
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): static
    {
        $this->lastName = $lastName;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // Si vous stockez des données temporaires sensibles sur l'utilisateur, effacez-les ici
    }

    /**
     * @see \Serializable::serialize()
     */
    public function __serialize(): array
    {
        return [
            'id' => $this->id,
            'email' => $this->email,
            'password' => $this->password,
            'roles' => $this->roles,
        ];
    }

    /**
     * @see \Serializable::unserialize()
     */
    public function __unserialize(array $data): void
    {
        $this->id = $data['id'];
        $this->email = $data['email'];
        $this->password = $data['password'];
        $this->roles = $data['roles'];
    }

    public function setPlainPassword(string $password): static
    {
        $this->plainPassword = $password;
        return $this;
    }

    public function getPlainPassword(): ?string
    {
        return $this->plainPassword;
    }
}
