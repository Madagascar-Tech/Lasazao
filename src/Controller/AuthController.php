<?php

namespace App\Controller;

use OpenApi\Annotations as OA;
use ApiPlatform\OpenApi\Model;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class AuthController extends AbstractController
{
    /**
     * @Route("/api/login_check", name="api_login_check", methods={"POST"})
     * @OA\Post(
     *     path="/api/login_check",
     *     summary="Authentifie un utilisateur et retourne un JWT",
     *     @OA\RequestBody(
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="email", type="string"),
     *             @OA\Property(property="password", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Retourne le token JWT",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="token", type="string")
     *         )
     *     )
     * )
     */
    public function login(): Response
    {
        // Cette méthode ne sera jamais exécutée, 
        // le JWT bundle intercepte la requête avant
        throw new \RuntimeException('You must configure the check path to be handled by the firewall');
    }
} 