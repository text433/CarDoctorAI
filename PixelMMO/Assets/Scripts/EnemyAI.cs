using UnityEngine;

public class EnemyAI : MonoBehaviour
{
    public float speed = 1.8f;
    public float aggroRange = 7f;
    public float attackRange = 1f;
    public int damage = 10;
    public float attackCooldown = 1f;
    private Transform target;
    private float nextAttack;

    private void Start()
    {
        var player = GameObject.FindGameObjectWithTag("Player");
        if (player) target = player.transform;
    }

    private void Update()
    {
        if (!target) return;
        float distance = Vector2.Distance(transform.position, target.position);
        if (distance > aggroRange) return;

        if (distance > attackRange)
            transform.position = Vector2.MoveTowards(transform.position, target.position, speed * Time.deltaTime);
        else if (Time.time >= nextAttack)
        {
            nextAttack = Time.time + attackCooldown;
            target.GetComponent<Health>()?.Damage(damage);
        }
    }
}
