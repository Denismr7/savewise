using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.ComponentModel.DataAnnotations;

namespace Savewise.Models
{
    public class Transaction
    {
        public int? tId { get; set; }
        public int tUserId { get; set; }
        public int tCategoryId { get; set; }
        public int tAmount { get; set; }
        public DateTime tDate { get; set; }
        public string tDescription { get; set; }
        public int tTypeId { get; set; }
        public virtual Category CategoryNavigation { get; set; }
        public virtual TransactionType TransactionTypeNavigation { get; set; }
    }

    public class TransactionConfig : IEntityTypeConfiguration<Transaction>
    {
        public void Configure(EntityTypeBuilder<Transaction> builder)
        {
            builder.ToTable("transactions");

            builder.Property(t => t.tId)
                   .HasColumnName("t_id")
                   .HasColumnType("int")
                   .ValueGeneratedOnAdd()
                   .IsRequired();

            builder.Property(t => t.tDescription)
                   .HasColumnName("t_description")
                   .HasColumnType("varchar")
                   .HasMaxLength(85)
                   .IsRequired();
            
            builder.Property(t => t.tAmount)
                   .HasColumnName("t_amount")
                   .HasColumnType("int")
                   .IsRequired();
            
            builder.Property(t => t.tUserId)
                   .HasColumnName("t_user_id")
                   .HasColumnType("int")
                   .IsRequired();
            
            builder.Property(t => t.tCategoryId)
                   .HasColumnName("t_category_id")
                   .HasColumnType("int")
                   .IsRequired();
            
            builder.Property(t => t.tTypeId)
                   .HasColumnName("t_transaction_type_id")
                   .HasColumnType("int")
                   .IsRequired();

            builder.HasOne(t => t.CategoryNavigation)
                   .WithMany(c => c.transactions)
                   .HasForeignKey(b => b.tCategoryId)
                   .HasConstraintName("FK_Transactions_CategoryID");
            
            builder.HasOne(t => t.TransactionTypeNavigation)
                   .WithMany(tt => tt.Transactions)
                   .HasForeignKey(b => b.tTypeId)
                   .HasConstraintName("FK_Transactions_TransactionTypeID");
        }
    }
}