using UnityEngine;

public class PlayerCombat : MonoBehaviour
{
    public float attackRadius = 1.25f;
    public int damage = 25;
    public float cooldown = .45f;
    public LayerMask enemyLayer;
    private float nextAttack;

    private void Update()
    {
        if ((Input.GetKeyDown(KeyCode.Space) || Input.GetMouseButtonDown(0)) && Time.time >= nextAttack)
            Attack();
    }

    public void Attack()
    {
        if (Time.time < nextAttack) return;
        nextAttack = Time.time + cooldown;
        foreach (var hit in Physics2D.OverlapCircleAll(transform.position, attackRadius, enemyLayer))
            hit.GetComponent<Health>()?.Damage(damage);
    }
}
